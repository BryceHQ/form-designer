/*
* return a col as container
*/
import React from 'react';

import Col from '../form/col';

const ColContainer = React.createClass({
	getDefaultProps() {
		return {
		};
	},

  render() {
    var {children, ...props} = this.props;
    return (
      <Col {...props} mode="display">
        {children}
      </Col>
    );
  },
});

export default ColContainer;
