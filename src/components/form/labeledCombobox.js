import React from 'react';
import classnames from 'classnames';

import Combobox from '../common/editor/combobox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledCheckbox = React.createClass({
	mixins: [DataBinding],

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
				<lable className="FormLabel" style={labelStyle} key="laebl">{label}</lable>
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
			<Combobox {...props} name={name} value={value} onChange={this._handleChange} style={style} key="editor"/>
		);

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

export default LabeledCheckbox;
