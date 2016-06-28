import React from 'react';
import ReactDOM from 'react-dom';
import FormSavedNotice from '../form_saved_notice.jsx';

var ReactTags = require('react-tag-input').WithContext;
import _ from 'underscore';
var contentTags = [];
var classNames = require('classnames');

var TagsEditor = React.createClass({

  getInitialState: function() {
	 $.ajax({
	   type: 'GET',
	   url: '/api/content-tags'
	 })
	 .success(function(dataTags) {
		  _.each(dataTags, function(dataTag){
            if (dataTag['type'] == "content") {
                contentTags.push(dataTag['tag']);
            }
		  });
	 });

	 return {
		  tags: [],
		  suggestions: contentTags,
      error: undefined,
      success: undefined
    }
  },
  handleDelete: function(i) {
    this.setState({ error: undefined});
    var data = {};
    data['template_id'] = this.props.id;

    var tags = this.state.tags;
    var tag = tags[i]['text'];
    data['tag'] = tag;

    tags.splice(i, 1);
    this.setState({tags: tags});

    $.ajax({
      type: 'DELETE',
      url: '/api/content-tags/',
      data: data,
      dataType: 'json',
    })
    .success(function(result) {
        if (result['success']) {
            tags.splice(i, 1);
            this.setState({tags: tags});
        }      

    }.bind(this))
    .error(function(result) {
      var error = result.responseJSON;
      if (error) {
        var errMessage = error['tag'] + error['message'];
        this.setState({ error: errMessage });
      }
    }.bind(this)); 
  },
  handleAddition: function(tag) {
    this.setState({ error: undefined});
    this.setState({ success: undefined});

    var data = {}; 
    if (this.props.id) {      
      data['template_id'] = this.props.id;
    }
    else {
      this.setState({ error: "Please add a Title above." });
      return;
    }

    data['tag'] = tag;

    $.ajax({
      type: 'POST',
      url: '/api/content-tags',
      data: data,
      dataType: 'json',
    })
    .success(function(result) {

      var tags = this.state.tags;

      tags.push({
        id: tags.length + 1,
        text: tag
      });
      this.setState({tags: tags});
      this.setState({ success: "tag saved" });

    }.bind(this))
    .error(function(result) {
      var error = result.responseJSON;
      if (error) {
        var errMessage = error['tag'] + error['message'];
        this.setState({ error: errMessage });
      }
    }.bind(this));   
  },
  handleDrag: function(tag, currPos, newPos) {
    var tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: tags });
    },
    render: function() {
      var tags = this.state.tags,groupClass = [];
      var suggestions = this.state.suggestions;
      var errValue = "";

      if (this.state.error) {
          errValue = this.state.error;
      }

      groupClass['tags'] = classNames({
        'form-group': true,
        'col-md-10': true,
        'has-error': this.state.error
      });

      return (
        <div className={groupClass['tags']} id="tags-editor">

        {this.state.success ?
              <FormSavedNotice/>
              : null}
        <label htmlFor='tags' className="control-label">Template Tags</label>
        <ReactTags tags={tags}
        suggestions={contentTags}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        handleDrag={this.handleDrag}
        autofocus={false}
        minQueryLength={2}
        />

        <span className="help-block text-danger">{errValue}</span>
      </div>
    )
  }
});

module.exports = TagsEditor;