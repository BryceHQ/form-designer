import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Checkbox from '../common/editor/checkbox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 8px',
	}
};

const LabeledCheckbox = function(container) {
	return React.createClass({
		mixins: [DataBinding, container],

		propTypes: {
			options: React.PropTypes.array,
		},

		getDefaultProps() {
			return {
				name: '',
				label: '名称',
		    value: '',
				on: true,
				off: false,
				vertical: false,
				optionsVertical: false,

				basic: '20%',
			};
		},

		render() {
			let {
				value, vertical, dataInputs, data, style, containerStyle,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			style = _.assign(styles.root, style);
			// labelStyle = _.assign({}, labelStyle);
			containerStyle = _.assign({}, containerStyle);

			var children = [];
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
				<Checkbox {...props} value={value} inline={!vertical} onChange={this._handleChange} style={style} key="editor"/>
			);

			var attributes = {
				style: containerStyle,
				basis,
				row,
				col,
				parent,
				target,
				uniqueKey,
				selectKey,
				//
				// dragDrop: {
				//
				// },
			};

			return this._getContainer(attributes, children);
		},

		_handleChange(value) {
			var {dataInputs, data} = this.props;
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

export default LabeledCheckbox;

const options = {
	name: 'LabeledCheckbox',
	attributes: {
		name: '',
		label: '名称',
		on: true,
		off: false,
		basis: '20%',
		vertical: false,
		style: {
		},
		containerStyle: {
		},
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
			data: {
				hidden: true,
			},
		},
	},
};

export {options};
