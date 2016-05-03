import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Colors from 'material-ui/lib/styles/colors';
import InkBar from 'material-ui/lib/ink-bar';


import Actions from '../../actions/actions';

import Store from '../../stores/store';

import {spacing} from '../../theme';

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
	},
	getDefaultProps () {
		return {
			gutter: spacing.gutter,
		};
	},

	render() {
		let { basis, gutter, width, style, uniqueKey, children, ...props } = this.props;

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

		if(Store.getData().selectKey == uniqueKey){
			children.push(
				<InkBar left = "0" width = "100%" color = {Colors.blue500}
					key="0"
				/>
			);
		}

		return (
			<div style={_.assign(columnStyle, style)} {...props}
				onClick={this._handleClick}
				onDoubleClick={this._handleDoubleClick}
			>
				{children}
			</div>
		);
	},

	_handleDoubleClick(event) {
		//col 下面有且仅有一个child
		var col = this.props.children[0].props.target;

		Actions.toggleRight(true, [{
				name: 'basic',
				data: col.children[0].attributes,
			}, {
				name: 'data',
				data: {},
			}
		]);
	},

	//选中高亮
	_handleClick(event) {
		//col 下面有且仅有一个child
		var col = this.props.children[0].props.target;

		Actions.select({
			key: col.attributes.key,
			data: [{
				name: 'basic',
				data: col.children[0].attributes,
			}, {
				name: 'data',
				data: {},
			}]
		});
	},
});

export default Col;
