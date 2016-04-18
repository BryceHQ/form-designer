import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Drop from '../draggable/drop';

const Form = React.createClass({
	propTypes: {
	},
	getDefaultProps () {
		return {
		};
	},
	render() {
		return (
      <form>
        {this.props.children}
      </form>
		);
	}
});

export default Form;
