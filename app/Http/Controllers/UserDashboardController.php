<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Bouncer;
use Log;
use App\Content;
use App\ContentStatus;
use App\TemplateSection;
use App\ContentSectionComment;
use App\User;

class UserDashboardController extends Controller
{
    /**
    * Display User Dashboard page.
    *
    * @param  Request  $request
    * @return \resources\views\dashboard.blade.php
    */
    public function index(Request $request)
    {

        $user = Auth::user();
        $workInProgress = [];
        $published = [];
        $feedbackNeeded = [];

        $contents = Content::where('created_by_user_id', '=', $user->id)->get();
        
        foreach($contents as $content) {
            $contentStatus = ContentStatus::where('content_id', '=', $content->id)
                                            ->orderBy('updated_at','desc')
                                            ->first();
            $content->status = $contentStatus->status;

            if ($contentStatus->status == "edit" || 
                $contentStatus->status == "peer review" ||
                $contentStatus->status == "expert review") {
                array_push($workInProgress,$content);

            }
            elseif ($contentStatus->status == "published") {
                array_push($published,$content);
            }

        }

        // Get Collaborative feedback
        $feedback = ContentSectionComment::where('feedback_on', '=', 1)->get();

        if ($feedback) {
            foreach ($feedback as $item){
                $content = Content::where('id', '=', $item->content_id)->orderBy('updated_at','desc')->first();
                $content['section_id'] = $item->template_section_id;
                $section = TemplateSection::find($item->template_section_id);
                $content['section_title'] = $section->section_title;
                $author = User::find($content->created_by_user_id);
                $content['author'] = $author->name;

                array_push($feedbackNeeded,$content);
            }
        }

        return view('dashboard')->with([
			'pageTitle'=>$user->name." Dashboard",
            'userName'=>$user->name,
			'workInProgress' => $workInProgress,
            'wipCount' =>count($workInProgress),
            'published' => $published,
            'pCount' =>count($published),
            'feedback' =>$feedbackNeeded,
            'fCount' => count($feedbackNeeded)
        ]);             
    }
}
