/*
* return a draggable col as container
*/
import React from 'react';

import Col from '../form/col';
import DragDrop from '../draggable/dragDrop';

const DraggableCol = {
  _getContainer(props, children) {
    var {style, basis, target, parent, selectKey, ...others} = props;
    return (
      <Col {...others} basis={basis} selected={selectKey === others.uniqueKey}>
        <DragDrop {...others} target={target} parent={parent} style={style} >
          {children}
        </DragDrop>
      </Col>
    );
  },
};

export default DraggableCol;
