import React from 'react';
import classnames from 'classnames';

import config from '../../config';

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
				name: '',
				label: '名称',
				placeholder: '请输入',
				required: false,
		    requiredMessage: '该项为必填项',
		    rule: '',
		    invalidMessage: '请输入有效值',
		    value: '',
				vertical: false,
				readOnly: false,

				basis: '20%',
			};
		},

		render() {
			let {
				label, vertical, dataInputs, data, value, style, labelStyle, containerStyle,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			style = Object.assign({}, style);
			labelStyle = Object.assign({}, labelStyle);
			containerStyle = Object.assign({}, containerStyle);
			if(vertical){
				labelStyle.display = 'block';
			}

			var children = [];
			if(label){
				children.push(
					<lable className="FormLabel" style={labelStyle} key="label">{label}</lable>
				);
			}

			var name = null;
			if(data){
				if(dataInputs){
					var result = this._compute();
					if(result.hidden === true){
						containerStyle = Object.assign({display: 'none'}, containerStyle);
					}
					value = result.value;
				}
				if(!data.computed){
					name = data.name;
				}
			}

			children.push(
				<Textbox {...props} name={name} value={value} onChange={this._handleChange} style={style} key="editor"/>
			);

			var attributes = {
				style: containerStyle,
				basis,
				row,
				col,
				parent,
				target,
				uniqueKey,
			};

			return (
				<div>
					{children}
				</div>
			);

		},

		_handleChange(value) {
			var {data, dataInputs} = this.props;
	    if(data.computed) return;
	    if(data.name && dataInputs){
				dataInputs[data.name] = this._getValueForType(data.type, value);
				if(this.props.emitChange){
					this.props.emitChange();
				}
	    }
		},

	});
};

export default LabeledTextbox;
