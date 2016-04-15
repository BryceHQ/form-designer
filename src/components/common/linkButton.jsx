import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

const LinkButton = React.createClass({

	propTypes: {
		block: React.PropTypes.bool,
		className: React.PropTypes.string,
		href: React.PropTypes.string,
		isActive: React.PropTypes.bool,
		submit: React.PropTypes.bool,
	},
	getDefaultProps() {
		return {
			type: 'default'
		};
	},
	render() {
		// classes
		var componentClass = classNames(
			'button',
			'link-button',
			{
				'is-active': this.props.isActive
			},
			this.props.className
		);

		// props
		var props = _.assign({}, this.props);
		props.className = componentClass;

		var tag = 'button';
		props.type = this.props.submit ? 'submit' : 'button';

		if (props.href) {
			tag = 'a';
			delete props.type;
		}

		return React.createElement(tag, props, this.props.children);
	}
});

export default LinkButton;
