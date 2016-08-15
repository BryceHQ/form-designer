/*
* 日期范围控件
*/
import React from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Actions from '../../actions/actions';

import Datebox from '../common/editor/datebox';

import DataBinding from '../mixins/dataBinding';


const LabeledDateboxRange = function(container){
	return React.createClass({
	  mixins: [DataBinding, container],

		propTypes: {
		},

		getDefaultProps() {
			return {
				name: '',
				label: '名称',
				required: false,
		    requiredMessage: '该项为必填项',
		    rule: '',
		    invalidMessage: '请输入有效值',
		    value: '',
				vertical: false,
				readOnly: false,

				basis: '20%',
			};
		},

		render() {
			let {
				label, vertical, dataInputs, data, start, end, startPlaceholder, endPlaceholder,
				style, labelStyle, containerStyle,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			style = Object.assign({}, style);
			labelStyle = Object.assign({}, labelStyle);
			containerStyle = Object.assign({}, containerStyle);
			if(vertical){
				labelStyle.display = 'block';
			}

			var children = [];
			if(label){
				children.push(
					<lable className="FormLabel" style={labelStyle} key="label">{label}</lable>
				);
			}

			var startName, endName;
			if(data){
				var {startData, endData} = data;
				if(dataInputs){
					var startResult = this._compute(startData);
					start = startResult.value;

					var endResult = this._compute(endData);
					end = endResult.value;
				}

				if(!startData.computed){
					startName = startData.name;
				}
				if(!endData.computed){
					endName = endData.name;
				}
			}

			children.push(
				<Datebox {...props} name={startName} value={start} startDate={start} endDate={end} onChange={this._handleChangeStart} style={style} placeholder={startPlaceholder} key="start"/>
			);
			children.push(
				<Datebox {...props} name={endName} value={end} startDate={start} endDate={end} onChange={this._handleChangeEnd} style={style} placeholder={endPlaceholder} key="end"/>
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
			};

			return this._getContainer(attributes, children);
		},

		_handleChangeStart(value) {
			var {data, dataInputs} = this.props;
			var {startData, endData} = data;
			if(!startData || startData.computed) return;
			if(dataInputs){
				var end = dataInputs[endData.name];
				if(end && this._getDate(end) < value._d){
					dataInputs[startData.name] = end;
					dataInputs[endData.name] = value;
				} else {
					dataInputs[startData.name] = value;
				}
				if(this.props.emitChange){
					this.props.emitChange();
				}
			}
		},

		_handleChangeEnd(value) {
			var {data, dataInputs} = this.props;
			var {startData, endData} = data;
			if(!endData || endData.computed) return;
			if(dataInputs){
				var start = dataInputs[startData.name];
				if(start && this._getDate(start) > value._d){
					dataInputs[startData.name] = value;
					dataInputs[endData.name] = start;
				} else {
					dataInputs[endData.name] = value;
				}
				if(this.props.emitChange){
					this.props.emitChange();
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
