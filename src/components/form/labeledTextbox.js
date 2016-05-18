import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Actions from '../../actions/actions';

import Textbox from '../common/editor/textbox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	},
};

const LabeledTextbox = function(container){
	return React.createClass({
	  mixins: [DataBinding, container],

		propTypes: {
		},

		getDefaultProps() {
			return {
				naem: '',
				label: '名称',
				placeholder: '请输入',
				required: false,
		    requiredMessage: '该项为必填项',
		    rule: '',
		    invalidMessage: '请输入有效值',
		    value: '',
				vertical: false,
				readOnly: false,

				basic: '20%',
			};
		},

		render() {
			let {
				label, vertical, dataInputs, data, value, style, labelStyle, containerStyle,
				parent, target, col, row, basis, uniqueKey,
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
				<Textbox {...props} value={value} onChange={this._handleChange} style={style} key="editor"/>
			);

			var attributes = {
				style: containerStyle,
				basis,
				row,
				col,
				parent,
				target,
				uniqueKey,
				//
				// dragDrop: {
				//
				// },
			};

			return this._getContainer(attributes, children);
		},

		_handleChange(value) {
			var {dataInputs, data} = this.props;
	    if(data.expression) return;
	    if(data.value){
				var input = this._findDataInput(dataInputs, data.value);
				if(input){
	        input.value = this._getValueForType(input, value);
					if(this.props.emitChange){
						this.props.emitChange();
					}
				}
	    }
		},

	});
};

export default LabeledTextbox;

const options = {
	name: 'LabeledTextbox',
	attributes: {
		name: '',
		label: '名称',
		placeholder: '请输入...',
		required: false,
		requiredMessage: '该项为必填项',
		rule: '',
		invalidMessage: '请输入有效值',
		basis: '20%',
		vertical: false,
		multiline: false,
		readOnly: false,
		data: {
			value: '',
      expression: '',
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
			multiline: {
				editor: {type: 'checkbox'},
			},
			readOnly: {
				editor: {type: 'checkbox'},
			},
			rule: {
				editor: {
					type: 'combobox',
					options: [{text: '请选择', value: ''},{text:'数字', value:'number'},{text:'数字和字母', value:'ASCII'}]
				}
			},
			requiredMessage: {
				hidden: {
					targetName: 'required',
					targetValues: true,
				}
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
