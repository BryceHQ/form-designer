/*
* return a col as container
*/
import React from 'react';

import Col from '../form/displayCol';

const ColContainer = {
  _getContainer(props, children) {
    return (
      <Col {...props}>
        {children}
      </Col>
    );
  },
};

export default ColContainer;
