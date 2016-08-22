import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import {spacing} from '../../../theme';

const Row = React.createClass({
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		gutter: React.PropTypes.number,
		style: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			gutter: spacing.gutter,
		};
	},
	render() {
		let { className, gutter, style, target, ...props } = this.props;
		let rowStyle = {
			display: 'flex',
			flexWrap: 'wrap',
			msFlexWrap: 'wrap',
			WebkitFlexWrap: 'wrap',
			// marginLeft: (gutter / -2),
			// marginRight: (gutter / -2),
		};
		let componentClass = classnames('Row', className);

		return (
			<div {...props} style={_.assign(rowStyle, style)} className={componentClass} />
		);
	}
});

export default Row;
