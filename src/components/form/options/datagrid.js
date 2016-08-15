/*
* 表格控件
*/

const options = {
	name: 'Datagrid',
	attributes: {
    title: '表格',
		url: '',
		method: 'get',
		idField: 'id',
		pageSize: 10,
		multiSelect: false,
		fit: true,
		fitColumns: true,
		toolbar: false,

		inlineEdit: true,
		addUrl: '',
		editUrl: '',
		removeUrl: '',

		rowNumber: true,
		rowNumberWidth: 20,
		pagination: true,
		paginationLabel: 'Displaying {start} to {end} of {total} items',
		columns: [
		  {field: 'id', label: 'id', width: '100', hidden: false},
			{field: 'text', label: 'text', width: '100', hidden: false},
		],

    basic: '20%',
    data: {
			value: '',
			hidden: '',
			// onChange: '',//function name
		},
		style: {},
		containerStyle: {height: '150px'},
		//内置属性，用来设置属性的特殊属性 editor, hidden
		_options: {
			columns: {
				defaultChild: {
					field: '', label: '', width: '', hidden: false,
					_options: {
						field: {
							editor: {autofocus: true}
						},
					},
				},
				//childOptions
				childName: 'column',
				childOptions: {
					hidden: {
						editor: {type: 'checkbox'}
					},
				},
			},
			pagination: {
				editor: {type: 'checkbox'},
			},
			fit: {
				editor: {type: 'checkbox'},
			},
			fitColumns: {
				editor: {type: 'checkbox'},
			},
			toolbar: {
				editor: {type: 'checkbox'},
			},

			inlineEdit: {
				editor: {type: 'checkbox'},
			},
			addUrl: {
				hidden: {
					targetName: 'inlineEdit',
					targetValues: false,
				}
			},
			editUrl: {
				hidden: {
					targetName: 'inlineEdit',
					targetValues: false,
				}
			},
			removeUrl: {
				hidden: {
					targetName: 'inlineEdit',
					targetValues: false,
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
			data: {
				hidden: true,
			},
		},
	},
};

export default options;
