import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Textbox from '../common/editor/textbox';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledInput = React.createClass({

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
		};
	},

	render() {
		let {label, vertical, ...props} = this.props;

		let labelStyle = {};
		if(vertical){
			labelStyle.display = 'block';
		}


		let labelElem = null;
		if(label){
			labelElem = <lable className="FormLabel" style={labelStyle}>{label}</lable>;
		}

		return (
			<div>
				{labelElem}
				<Textbox {...props}/>
			</div>
		);
	}
});

export default LabeledInput;

const options = {
	name: 'LabeledInput',
	attributes: {
		name: '',
		label: '名称',
		placeholder: '请输入...',
		required: false,
		requiredMessage: '该项为必填项',
		rule: '',
		invalidMessage: '请输入有效值',
		vertical: false,
		multiline: false,
		style: {
		},
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
			rule: {
				editor: {
					type: 'combobox',
					options: [{text: '请选择', value: ''},{text:'数字和字母', value:'ASCII'}]
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
		},
	},
};

export {options};
