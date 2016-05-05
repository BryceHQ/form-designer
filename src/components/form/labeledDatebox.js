/*
* 日期控件
*/

import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Actions from '../../actions/actions';

import Datebox from '../common/editor/datebox';

import DataBinding from '../mixins/dataBinding';
import DraggableContainer from '../mixins/draggableContainer';

const styles = {
	root: {
		padding: '2px 0',
	},
};

const LabeledDatebox = React.createClass({
  mixins: [DataBinding, DraggableContainer],

	propTypes: {
	},

	getDefaultProps() {
		return {
			name: '',
			label: '名称',
			placeholder: '请输入...',
			basis: '20%',
			dateFormat: 'YYYY-MM-DD',
			todayButton: true,
			vertical: false,
			readOnly: false,
			showYearDropdown: false,

			dragDrop: true,
			basic: '20%',
		};
	},

	render() {
		let {
			label, vertical, dataInputs, data, value, style, labelStyle, containerStyle,
			dragDrop, parent, target, col, row, basis, uniqueKey,
			...props
		} = this.props;

		style = _.assign({}, style);
		labelStyle = _.assign({}, labelStyle);
		containerStyle = _.assign({}, containerStyle);
		if(vertical){
			labelStyle.display = 'block';
		}

		var children = [];
		if(label){
			children.push(
				<lable className="FormLabel" style={labelStyle} key="label">{label}</lable>
			);
		}

		if(dataInputs && data){
			var result = this._compute();
			if(result.hidden === true){
				containerStyle = _.assign({display: 'none'}, containerStyle);
			}
			if(data.value || data.expression){
				value = result.value;
			}
		}

		children.push(
			<Datebox {...props} value={value} onChange={this._handleChange} style={style} key="editor"/>
		);

		var attributes = {
			style: containerStyle,
			basis,
			//
			// dragDrop: {
			//
			// },
		};

		if(dragDrop){
			_.assign(attributes, {
				row: row,
				col: col,
				parent: parent,
				target: target,
				uniqueKey: uniqueKey,
			});
			return this._getDraggableContainer(attributes, children);
		}

		return this._getContainer(attributes, children);
	},

	_handleChange(value) {
		var {dataInputs, data} = this.props;
    if(data.expression) return;
    if(data.value){
			var input = this._findDataInput(dataInputs, data.value);
			if(input){
        input.value = this._getValueForType(input, value);
				Actions.valueChange();
			}
    }
	},

});

export default LabeledDatebox;

const options = {
	name: 'LabeledDatebox',
	attributes: {
		name: '',
		label: '名称',
		placeholder: '请选择日期...',
		basis: '20%',
		dateFormat: 'YYYY-MM-DD',
		todayButton: true,
		vertical: false,
		readOnly: false,
		showYearDropdown: false,
		data: {
			value: '',
			hidden: '',
			onChange: '',//function name
		},
		style: {},
		containerStyle: {},
		labelStyle: {},
		//内置属性，用来设置属性的特殊属性 editor, hidden
		_options: {
			required: {
				editor: {type: 'checkbox'},
			},
			vertical: {
				editor: {type: 'checkbox'},
			},
			todayButton: {
				editor: {type: 'checkbox'},
			},
			readOnly: {
				editor: {type: 'checkbox'},
			},
			showYearDropdown: {
				editor: {type: 'checkbox'},
			},
			style: {
				keyEditable: true,
				defaultChild: {'':''},
			},
			containerStyle: {
				keyEditable: true,
				defaultChild: {'':''},
			},
			labelStyle: {
				keyEditable: true,
				defaultChild: {'':''},
			},
			data: {
				hidden: true,
			},
		},
	},
};

export {options};
