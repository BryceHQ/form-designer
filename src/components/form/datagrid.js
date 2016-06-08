/*
* 表格控件
*/

import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Datagrid from 'datagrid';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	},
};

/*
* @param isDisplay 是否是显示状态
*/
const FormDatagrid = function(container, isDisplay){
	return React.createClass({
	  mixins: [DataBinding, container],

		propTypes: {
		},

		getDefaultProps() {
			return {
				name: '',
				title: '表格',
				idField: 'id',
				method: 'get',
				pageSize: 10,
				multiSelect: false,
        fit: true,
				fitColumns: true,
				rowNumber: true,
				rowNumberWidth: 20,
        pagination: true,
				paginationOptions : [10, 20, 30, 40, 50],
				paginationLabel: 'Displaying {start} to {end} of {total} items',
				columns: [],
				inlineEdit: false,

				basic: '20%',

				recomputeWidthEverytime: !isDisplay,
			};
		},

		render() {
			let {
				dataInputs, data, style, containerStyle, inlineEdit,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			style = _.assign({}, style);
			containerStyle = _.assign({}, containerStyle);

			var value = [];
			if(dataInputs && data){
				var result = this._compute();
				if(result.hidden === true){
					containerStyle = _.assign({display: 'none'}, containerStyle);
				}
				if(data.value || data.expression){
					value = result.value;
				}
			}

			var attributes = {
				style: containerStyle,
				basis,
				row,
				col,
				parent,
				target,
				uniqueKey,
				selectKey,
			};
      var children = (
        <Datagrid {...props} data={value} inlineEdit={inlineEdit}
					onAdd={inlineEdit ? null : this._handleAdd}
					onEdit={inlineEdit ? null : this._handleEdit}
					onRemove={inlineEdit ? null : this._handleRemove}></Datagrid>
      );

			return this._getContainer(attributes, children);
		},

		_handleChange(value) {
			var {dataInputs, data} = this.props;
	    if(data.expression) return;
	    if(data.value){
				var input = this._findDataInput(dataInputs, data.value);
				if(input){
	        input.value = this._getValueForType(input, value);
					if(this.props.emitChange){
						this.props.emitChange();
					}
				}
	    }
		},

		_handleAdd() {

		},

		_handleEdit(key) {

		},

		_handleRemove(keys) {

		},
	});
};

export default FormDatagrid;

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
		containerStyle: {},
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

export {options};
