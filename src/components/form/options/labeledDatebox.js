import config from '../../../config';

const options = {
	name: 'LabeledDatebox',
	attributes: {
		label: '名称',
		placeholder: '请选择日期...',
		basis: '20%',
		dateFormat: 'YYYY-MM-DD',
		todayButton: true,
		vertical: false,
		readOnly: false,
		showYearDropdown: false,
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
			todayButton: {
				editor: {type: 'checkbox'},
			},
			readOnly: {
				editor: {type: 'checkbox'},
			},
			showYearDropdown: {
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
			data: {
				hidden: true,
			},
		},
	},
};

export default options;
