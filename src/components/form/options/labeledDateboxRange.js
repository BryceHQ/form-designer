/*
* 日期范围控件
*/
import config from '../../../config';

const dataOptions = {
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
	displayName: {
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
};

const options = {
	name: 'LabeledDateboxRange',
	attributes: {
		label: '名称',
		startPlaceholder: '请选择开始日期...',
		endPlaceholder: '请选择结束日期...',
		basis: '20%',
		dateFormat: 'YYYY-MM-DD',
		todayButton: true,
		vertical: false,
		readOnly: false,
		showYearDropdown: false,
		data: {
			startData: {
				computed: false,
				name: '',
				type: '',
				defaultValue: '',
				displayName: '',
				expression: '',
				onChange: '', //function name
				_options: dataOptions,
			},
			endData: {
				computed: false,
				name: '',
				type: '',
				defaultValue: '',
				displayName: '',
				expression: '',
				onChange: '', //function name
				_options: dataOptions,
			},
			hidden: '',
		},
		style: {},
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
