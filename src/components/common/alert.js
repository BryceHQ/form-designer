import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import classNames from 'classnames';

const ALERT_TYPES = [
	'danger',
	'error', // alias for danger
	'info',
	'primary',
	'success',
	'warning'
];

const Alert = React.createClass({
	mixins: [PureRenderMixin],

	propTypes: {
    type: React.PropTypes.string,
    className: React.PropTypes.string,
  },

	render() {
		var componentClass = classNames(
			'Alert',
			'Alert--' + this.props.type,
			this.props.className
		);

		return (
			<div className={componentClass}>{this.props.children}</div>
		);
	}
});

export default Alert;
