import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Combobox from '../common/editor/combobox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledCheckbox = function(container){
	return React.createClass({
		mixins: [DataBinding, container],

		propTypes: {
		},

		getDefaultProps() {
			return {
				name: '',
				label: '名称',
		    value: '',
				vertical: false,
				options: [],

				basic: '20%',
			};
		},

		render() {
			let {
				value, label, vertical, dataInputs, data, style, containerStyle, labelStyle,
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
					<lable className="FormLabel" style={labelStyle} key="laebl">{label}</lable>
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
				<Combobox {...props} value={value} onChange={this._handleChange} style={style} key="editor"/>
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
			}

			return this._getContainer(attributes, children);
		},

		_handleChange(value) {
			var {dataInputs, data} = this.props;
			if(dataInputs && data.value){
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

export default LabeledCheckbox;

const options = {
	name: 'LabeledCombobox',
	attributes: {
		name: '',
		label: '名称',
		basis: '20%',
		vertical: false,
		options: [{text: '请选择', value: ''}, {text: '选项 1', value: '1'}],
		style: {},
		containerStyle: {},
		labelStyle: {},
		data: {
			value: '',
      // expression: '',
			hidden: '',
			onChange: '',//function name
		},
		//内置属性，用来设置属性的特殊属性 editor, hidden
		_options: {
			vertical: {
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
			options: {
				defaultChild: {
					text: '', value: '',
					_options: {
						text: {
							editor: {autofocus: true}
						}
					},
				},
				//childOptions
				childName: 'option',
			},
			data: {
				hidden: true,
			},
		},

	},
};

export {options};
