@extends('layouts.adminApp')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div>
                    <h2>{{ $pageTitle }}</h2>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <div id="formSavedNotice"></div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                
                <div id="template" 
                @if($rubric)data-rubric="{{ $rubric }}"@endif
                @if($rubricCompetencies)data-rubricCompetencies="{{ $rubricCompetencies}}"@endif
                @if($sections)data-sections="{{ $sections }}"@endif
                @if($sectionsFields)data-sectionsFields="{{ $sectionsFields }}"@endif
                @if($tags)data-tags="{{ $tags }}"@endif 
                @if($course)data-courseInfo="{{ $course }}"@endif 
                data-templateInfo="{{ $template }}">
                </div>
            </div>
        </div>
    </div>    
@endsection