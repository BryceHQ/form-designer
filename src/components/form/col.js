/*
* 编辑状态的col，支持选中等操作
*/
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Colors from 'material-ui/lib/styles/colors';
import InkBar from 'material-ui/lib/ink-bar';

import Actions from '../../actions/actions';

import {spacing} from '../../theme';

import Col from './common/col';
import DragDrop from '../draggable/dragDrop';

const FormCol = React.createClass({
	propTypes: {
    children: React.PropTypes.node.isRequired,
	},
	getDefaultProps () {
		return {
		};
	},

	render() {
		let { target, children, ...props } = this.props;

		if(target.isSelected()){
			if(!_.isArray(children)){
				children = [children];
			}
			children.push(
				<InkBar left = "0" width = "100%" color = {Colors.blue500}
					key="0"
				/>
			);
		}

		return (
			<Col {...props} basis={'20%'}
				onClick={this._handleClick}
				onDoubleClick={this._handleDoubleClick}
			>
				<DragDrop target={target}>
					{children}
				</DragDrop>
			</Col>
		);
	},

	_handleDoubleClick(event) {
		//col 下面有且仅有一个child
		var col = this.props.children.props.target;

		Actions.toggleRight(true, [{
				name: 'basic',
				data: col.attributes,
			}, {
				name: 'data',
				data: col.attributes.data,
			}]
		);
	},

	//选中高亮
	_handleClick(event) {
		//col 下面有且仅有一个child
		Actions.select(this.props.target);
	},
});

export default FormCol;
