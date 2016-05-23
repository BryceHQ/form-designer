import React from 'react';

import Textbox from '../common/editor/textbox';
import Checkbox from '../common/editor/checkbox';
import Combobox from '../common/editor/combobox';

const Editor = React.createClass({
  getDefaultProps() {
    return {
      type: 'default',
    };
  },

  render() {
    var {type, ...props} = this.props;

    switch (type.toLowerCase()) {
      case 'checkbox':
        return (
          <Checkbox {...props}/>
        );
      case 'combobox':
        return (
          <Combobox {...props}/>
        );
      default:
        return (
          <Textbox {...props}/>
        );
    }

  },
});

export default Editor;
