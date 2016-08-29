import React from 'react';
import classnames from 'classnames';

import Checkbox from '../common/editor/checkbox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 1px',
	}
};

const LabeledCheckbox = React.createClass({
	mixins: [DataBinding],

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
			value, label, vertical, dataInputs, data, style, labelStyle, containerStyle,
			parent, target, col, row, basis, uniqueKey, selectKey,
			...props
		} = this.props;

		style = Object.assign(styles.root, style);
		labelStyle = Object.assign({}, labelStyle);
		containerStyle = Object.assign({}, containerStyle);

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
			<Checkbox {...props} name={name} value={value} inline={!vertical} onChange={this._handleChange} style={style} key="editor"/>
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
