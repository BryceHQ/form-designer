import React from 'react';
import Dropzone from 'dropzone';
import _ from 'lodash';

import DropzoneComponent from 'react-dropzone-component';

import lang from '../../lang.js';


var componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.gif'],
  showFiletypeIcon: true,
  postUrl: '/upload'
};

/**
 * For a full list of possible configurations,
 * please consult
 * http://www.dropzonejs.com/#configuration
 */
var _config = {
  addRemoveLinks: false,
  maxFilesize: '5MB',
  uploadMultiple: false,
  dictDefaultMessage: lang.message.upload,
  acceptedFiles: "image/jpeg,image/png,image/gif",
};

//
// /**
//  * Attach event handlers here to be notified
//  * for pretty much any event.
//  * Arrays are accepted.
//  */
// var eventHandlers = {
//     // All of these receive the event as first parameter:
//     drop: null,
//     dragstart: null,
//     dragend: null,
//     dragenter: null,
//     dragover: null,
//     dragleave: null,
//     // All of these receive the file as first parameter:
//     addedfile: null,
//     removedfile: null,
//     thumbnail: null,
//     error: null,
//     processing: null,
//     uploadprogress: null,
//     sending: null,
//     success: null,
//     complete: null,
//     canceled: null,
//     maxfilesreached: null,
//     maxfilesexceeded: null,
//     // All of these receive a list of files as first parameter
//     // and are only called if the uploadMultiple option
//     // in djsConfig is true:
//     processingmultiple: null,
//     sendingmultiple: null,
//     successmultiple: null,
//     completemultiple: null,
//     canceledmultiple: null,
//     // Special Events
//     totaluploadprogress: null,
//     reset: null,
//     queuecompleted: null
// };


const Upload = React.createClass({

	propTypes: {
  },

	render() {
    var {url, eventHandlers, config} = this.props;
    config = _.assign(config || {}, _config);
    if(url){
      componentConfig.postUrl = url;
    }

		return (
      <DropzoneComponent config={componentConfig} eventHandlers={eventHandlers} djsConfig={config} />
    );
	},

  _handleSuccess(file, data) {
    //add a custom button

    // Create the remove button
    var removeButton = Dropzone.createElement(`<button class="button link-button">${lang.message.background}</button>`);


    // Listen to the click event
    removeButton.addEventListener("click", function(e) {
      // Make sure the button click doesn't submit the form:
      e.preventDefault();
      e.stopPropagation();

      if(this.props.onDefaultBtn){
        this.props.onDefaultBtn(data);
      }
    });

    // Add the button to the file preview element.
    file.previewElement.appendChild(removeButton);

    if(this.props.onSuccess){
      this.props.onSuccess(data);
    }
  },
});

export default Upload;
