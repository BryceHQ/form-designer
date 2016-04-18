import React from 'react';
//
// DefaultEditor = require './DefaultEditor'
// Combobox = require './Combobox'
// GlobalizedEditor = require './GlobalizedEditor'
// Template = require './Template'
// Checkbox = require './Checkbox'
// Multicheckbox = require './Multicheckbox'

import Textbox from '../common/textbox';

const Editor = React.createClass({
  getDefaultProps() {
    return {
      type: 'default',
    };
  },

  render() {
    var {type, value, className, onChange} = this.props;

    return (
      <Textbox {...this.props}/>
    );

  },
});

export default Editor;
