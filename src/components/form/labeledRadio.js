import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Actions from '../../actions/actions';

import Radio from '../common/editor/radio';

import DataBinding from '../mixins/dataBinding';
import DraggableContainer from '../mixins/draggableContainer';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledRadio = React.createClass({
	mixins: [DataBinding, DraggableContainer],

	propTypes: {
		options: React.PropTypes.array,
	},

	getDefaultProps() {
		return {
			name: '',
			label: '名称',
	    value: '',
			vertical: false,
			optionsVertical: false,
			options: [],

			dragDrop: true,
			basic: '20%',
		};
	},

	render() {
		let {
			value, label, vertical, style, name, options, optionsVertical, dataInputs, data, containerStyle, labelStyle,
			dragDrop, parent, target, col, row, basis, uniqueKey,
			...props
		} = this.props;

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
		var me = this;
		options.forEach(function(opt, i){
			children.push(
				<Radio name={name} label={opt.text} value={opt.value} checked={opt.value === value}
					inline={!optionsVertical} key={i}
					onChange = {me._handleChange}/>
			);
		});

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
    if(dataInputs && data.value){
			var input = this._findDataInput(dataInputs, data.value);
			if(input){
        input.value = this._getValueForType(input, value);
				Actions.valueChange();
			}
    }
	},
});

export default LabeledRadio;

const options = {
	name: 'LabeledRadio',
	attributes: {
		name: '',
		label: '名称',
		basis: '20%',
		vertical: false,
		optionsVertical: false,
		options: [{text: 'click here', value: 'here'}, {text: 'click there', value: 'there'}],
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
			optionsVertical: {
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
