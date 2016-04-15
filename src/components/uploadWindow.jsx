import React from 'react';
import Dropzone from 'dropzone';
import _ from 'lodash';

import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';

import Upload from './common/upload.jsx';

import lang from '../lang.js';

import Store from '../stores/store.js';

import Actions from '../actions/actions.js';

const styles = {
  content: {
    width: '100%',
    height: '100%',
    maxWidth: null,
  },
  body: {
    maxHeight: null,
  },
  actions: {
    textAlign: 'center',
  },
};

const UploadWindow = React.createClass({
	render() {
    var {url, config, open} = this.props;
    url = url || Store.getConfig().upload;
    var eventHandlers = {
      success: this._handleSuccess,
    };
		return (
      <Dialog
        title={lang.message.uploadBG}
        modal={false}
        autoDetectWindowHeight={true}
        open={open}
        onRequestClose={this._handleClose}
        contentStyle={styles.content}
        bodyStyle={styles.body}
        actionsContainerStyle={styles.actions}
        actions={[
          <RaisedButton
            label={lang.button.close}
            secondary={true}
            onTouchTap={this._handleClose}
          />
        ]}
      >
        <Upload url={url} config={config} eventHandlers={eventHandlers}/>
      </Dialog>
    );
	},

  _handleClose(){
    Actions.changeMode();
  },

  _handleSuccess(file, data) {
    //add a custom button
    if(!data) return;
    if(data.success === false){
      Actions.setError(data.message);
      return;
    }
    // Create the remove button
    var removeButton = Dropzone.createElement(`<button class="button link-button">${lang.button.background}</button>`);


    // Listen to the click event
    removeButton.addEventListener("click", function(e) {
      // Make sure the button click doesn't submit the form:
      e.preventDefault();
      e.stopPropagation();

      Actions.setDefaultBackground(data);
    });

    // Add the button to the file preview element.
    file.previewElement.appendChild(removeButton);

    Actions.setBackground(data);
  },
});

export default UploadWindow;
