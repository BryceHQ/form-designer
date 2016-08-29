/*
* 日期控件
*/

import React from 'react';
import classnames from 'classnames';

import Datebox from '../common/editor/datebox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	},
};

const LabeledDatebox = React.createClass({
  mixins: [DataBinding],

	propTypes: {
	},

	getDefaultProps() {
		return {
			name: '',
			label: '名称',
			placeholder: '请输入...',
			dateFormat: 'YYYY-MM-DD',
			todayButton: true,
			vertical: false,
			readOnly: false,
			showYearDropdown: false,

			basis: '20%',
		};
	},

	render() {
		let {
			label, vertical, dataInputs, data, value, style, labelStyle, containerStyle,
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
				<lable key="label">
					<span className="FormLabel" style={labelStyle}>
						{label}
					</span>
				</lable>
			);
		}

		var name = null;
		if(data){
			if(dataInputs){
				var result = this._compute();
				if(result.hidden === true){
					containerStyle = Object.assign({display: 'none'}, containerStyle);
				}
				value = result.value;
			}
			if(!data.computed){
				name = data.name;
			}
		}

		children.push(
			<Datebox {...props} name={name} value={value} onChange={this._handleChange} style={style} key="editor"/>
		);

		return (
			<div>
				{children}
			</div>
		);
	},

	_handleChange(value) {
		var {data, dataInputs} = this.props;
		if(data.computed) return;
		if(data.name && dataInputs){
			dataInputs[data.name] = this._getValueForType(data.type, value);
			if(this.props.emitChange){
				this.props.emitChange();
			}
		}
	},

});

export default LabeledDatebox;
