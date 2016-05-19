/*
* 日期范围控件
*/
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import moment from'moment';

import Actions from '../../actions/actions';

import Datebox from '../common/editor/datebox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	},
};

const LabeledDateboxRange = function(container){
	return React.createClass({
	  mixins: [DataBinding, container],

		propTypes: {
		},

		getDefaultProps() {
			return {
				naem: '',
				label: '名称',
				required: false,
		    requiredMessage: '该项为必填项',
		    rule: '',
		    invalidMessage: '请输入有效值',
		    value: '',
				vertical: false,
				readOnly: false,

				basic: '20%',
			};
		},

		render() {
			let {
				label, vertical, dataInputs, data, start, end, startPlaceholder, endPlaceholder, style, labelStyle, containerStyle,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			style = _.assign({}, style);
			labelStyle = _.assign({}, labelStyle);
			containerStyle = _.assign({}, containerStyle);
			if(vertical){
				labelStyle.display = 'block';
			}

			var children = [];
			if(label){
				children.push(
					<lable className="FormLabel" style={labelStyle} key="label">{label}</lable>
				);
			}

			if(dataInputs && data){
				var startResult = this._compute({
					value: data.startValue,
					expression: data.startExpression,
					hidden: data.hidden,
				});
				if(startResult.hidden === true){
					containerStyle = _.assign({display: 'none'}, containerStyle);
				}
				if(data.startValue || data.startExpression){
					start = startResult.value;
				}

				var endResult = this._compute({
					value: data.endValue,
					expression: data.endExpression,
					hidden: data.hidden,
				});
				if(data.endValue || data.endExpression){
					end = endResult.value;
				}
			}

			children.push(
				<Datebox {...props} value={start} startDate={start} endDate={end} onChange={this._handleChangeStart} style={style} placeholder={startPlaceholder} key="start"/>
			);
			children.push(
				<Datebox {...props} value={end} startDate={start} endDate={end} onChange={this._handleChangeEnd} style={style} placeholder={endPlaceholder} key="end"/>
			);

			var attributes = {
				style: containerStyle,
				basis,
				row,
				col,
				parent,
				target,
				uniqueKey,
				selectKey,
				//
				// dragDrop: {
				//
				// },
			}

			return this._getContainer(attributes, children);
		},

		_handleChangeStart(value) {
			var {dataInputs, data} = this.props;
	    if(data.startValue){
				var input = this._findDataInput(dataInputs, data.startValue);
				if(input){
					var otherInput = this._findDataInput(dataInputs, data.endValue);
					if(otherInput && this._getDate(otherInput.value) < value._d){
						input.value = otherInput.value;
						otherInput.value = value;
					} else {
						input.value = value;
					}
					if(this.props.emitChange){
						this.props.emitChange();
					}
				}
	    }
		},

		_handleChangeEnd(value) {
			var {dataInputs, data} = this.props;
	    if(data.endValue){
				var input = this._findDataInput(dataInputs, data.endValue);
				if(input){
					var otherInput = this._findDataInput(dataInputs, data.startValue);
					if(otherInput && this._getDate(otherInput.value) > value._d){
						input.value = otherInput.value;
						otherInput.value = value;
					} else {
						input.value = value;
					}
					if(this.props.emitChange){
						this.props.emitChange();
					}
				}
	    }
		},

		_getDate(date){
			if(_.isDate(date)){
				return date;
			}
			if(_.isString(date)){
				var mom = moment(date);
				if(mom.isValid()){
					return mom._d;
				} else {
					console.error(`error: invalid string to get moment( ${date} )`);
				}
			}
			return date._d;
		},

	});
};

export default LabeledDateboxRange;

const options = {
	name: 'LabeledDateboxRange',
	attributes: {
		name: '',
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
			startValue: '',
			endValue: '',
			hidden: '',
			onChange: '',//function name
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

export {options};
