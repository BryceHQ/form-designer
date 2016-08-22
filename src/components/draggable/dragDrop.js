import React from 'react';
import _ from 'lodash';

import Colors from 'material-ui/lib/styles/colors';

import Drag from './drag';
import Drop from './drop';

const DragDrop = React.createClass({
  propTypes: {
    dragType: React.PropTypes.string,
    target: React.PropTypes.object,
  },

  render() {
    const {children, target, style, ...props} = this.props;
    return(
      <Drag target={target} {...props}>
        <Drop target={target} parent={parent} style={style}>
          {children}
        </Drop>
      </Drag>
    );
  },

});

export default DragDrop;
