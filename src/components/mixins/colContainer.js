/*
* return a col as container
*/
import React from 'react';

import Col from '../form/col';

const ColContainer = {
  _getContainer(props, children) {
    return (
      <Col {...props} mode="display">
        {children}
      </Col>
    );
  },
};

export default ColContainer;
