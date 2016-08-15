/*
*	单独文件定义 options，这样在 display 模式就可以不引用这些文件
*/
import config from '../../../config';

const options = {
	name: 'LabeledTextbox',
	attributes: {
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
			computed: false,
			name: '',
			type: '',
			defaultValue: '',
      expression: '',
			hidden: '',
			onChange: '', //function name
			_options: {
				computed: {
					editor: {type: 'checkbox'},
				},
				name: {
					hidden: {
						targetName: 'computed',
						targetValues: false,
					}
				},
				type: {
					editor: config.get('editors.type'),
					hidden: {
						targetName: 'computed',
						targetValues: false,
					}
				},
				defaultValue: {
					hidden: {
						targetName: 'computed',
						targetValues: false,
					}
				},
				expression: {
					hidden: {
						targetName: 'computed',
						targetValues: true,
					}
				},
			},
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

export default options;
