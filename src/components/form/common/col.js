/*
* col
*/
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import {spacing} from '../../../theme';

const Col = React.createClass({
	propTypes: {
		basis: React.PropTypes.oneOfType([
			React.PropTypes.number, // allow pixels
			React.PropTypes.string, // allow percentage
		]),
    width: React.PropTypes.oneOfType([
			React.PropTypes.number, // allow pixels
			React.PropTypes.string, // allow percentage
		]),
    children: React.PropTypes.node.isRequired,
		gutter: React.PropTypes.number,
		style: React.PropTypes.object,
		mode: React.PropTypes.string,
	},
	getDefaultProps () {
		return {
			gutter: spacing.gutter,
		};
	},

	render() {
		let { basis, gutter, className, width, mode, style, children, ...props } = this.props;

		let componentClass = classnames('Col', className);

		let columnStyle = {
			minHeight: 10,
			// paddingLeft: (gutter / 2),
			// paddingRight: (gutter / 2),
		};

		// if no width control is provided fill available space
		if (!basis && !width) {
			columnStyle.flex = '1 1 auto';
			columnStyle.msFlex = '1 1 auto';
			columnStyle.WebkitFlex = '1 1 auto';
		}

		// set widths / flex-basis
		if (basis) {
			columnStyle.flex = '1 0 ' + basis;
			columnStyle.msFlex = '1 0 ' + basis;
			columnStyle.WebkitFlex = '1 0 ' + basis;
		} else {
			columnStyle.width = width;
		}

		if (!columnStyle.width) {
			columnStyle.width = '100%';
		}

		return (
			<div {...props}
				className={componentClass}
				style={_.assign(columnStyle, style)} >
				{children}
			</div>
		);
	},
});

export default Col;
