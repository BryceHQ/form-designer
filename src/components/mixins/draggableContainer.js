/*
* return a draggable col as container
*/
import React from 'react';

import Col from '../form/col';
import DragDrop from '../draggable/dragDrop';

const DraggableCol = {
  _getContainer(props, children) {
    return (
      <Col {...props} mode="display">
        {children}
      </Col>
    );
  },

  _getDraggableContainer(props, children) {
    var {style, basis, target, parent, ...others} = props;
    return (
      <Col {...others} basis={basis} style={style}>
        <DragDrop {...others} target={target} parent={parent}>
          {children}
        </DragDrop>
      </Col>
    );
  }
};

export default DraggableCol;
