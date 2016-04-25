import React from 'react';
import _ from 'lodash';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';

import Drag from './drag';
import Drop from './drop';

const DragDrop = React.createClass({
  propTypes: {
    dragType: React.PropTypes.string,
    target: React.PropTypes.object,
  },

  render() {
    const {children, row, col, target, parent, style} = this.props;
    var props = _.omit(this.props, ['children', 'style']);

    return(
      <Drag {...props}>
        <Drop row={row} col={col} target={target} parent={parent} style={style}>
          {children}
        </Drop>
      </Drag>
    );
  },

});

export default DragDrop;
