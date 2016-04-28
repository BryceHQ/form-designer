import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Combobox from '../common/editor/combobox';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledCheckbox = React.createClass({

	propTypes: {
	},

	getDefaultProps() {
		return {
			name: '',
			label: '名称',
	    value: '',
			vertical: false,
			options: [],
		};
	},

	render() {
		let {label, vertical, style} = this.props;
		let props = _.omit(this.props, ['label', 'vertical', 'style']);

		let labelStyle = {};
		if(vertical){
			labelStyle.display = 'block';
		}


		let labelElem = null;
		if(label){
			labelElem = <lable className="FormLabel" style={labelStyle}>{label}</lable>;
		}

		return (
			<div style={style}>
				{labelElem}
				<Combobox {...props}/>
			</div>
		);
	}
});

export default LabeledCheckbox;

const options = {
	name: 'LabeledCombobox',
	attributes: {
		name: '',
		label: '名称',
		vertical: false,
		options: [{text: '请选择', value: ''}, {text: '选项 1', value: '1'}],
		style: {
			color: 'red',
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
			options: {
				defaultChild: {text: '', value: ''},
				//childOptions
				childName: 'option',
			},
		},
	},
};

export {options};
