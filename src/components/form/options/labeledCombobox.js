import config from '../../../config';

const options = {
	name: 'LabeledCombobox',
	attributes: {
		label: '名称',
		basis: '20%',
		vertical: false,
		options: [{text: '请选择', value: ''}, {text: '选项 1', value: '1'}],
		style: {},
		labelStyle: {},
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
		//内置属性，用来设置属性的特殊属性 editor, hidden
		_options: {
			vertical: {
				editor: {type: 'checkbox'},
			},
			style: {
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

export default options;
