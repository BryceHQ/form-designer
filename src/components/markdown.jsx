import React from 'react';

import Actions from '../actions/actions.js';
import Constants from '../constants/constants.js';

import _ from 'lodash';
import marked from 'marked';

import Editor from './markdown/MDEditor.jsx';

const Markdown = React.createClass({

  render() {
    let {content, mode, style, transition, duang} = this.props;

    if(mode === Constants.MODE.MARKDOWN){
      return (
        <Editor value={this.props.content} transition={transition} duang={duang} onChange={_.debounce(this._updateContent, 3000)} />
      );
    }
    let preview = '';
    if(content){
      preview = marked(content);
    }
    return (
      <div className="preview" style = {style}
        dangerouslySetInnerHTML={{__html: preview}}
      />
    );
  },

  _updateContent (newContent) {
    Actions.contentChange(newContent, this.props.index);
	},

});

export default Markdown;
