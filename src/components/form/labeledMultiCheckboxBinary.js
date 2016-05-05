// /*
// * 复合多checkbox二进制值控件
// */
// import React from 'react';
// import _ from 'lodash';
// import classnames from 'classnames';
//
// import Actions from '../../actions/actions';
//
// import Checkbox from '../common/editor/checkbox';
//
// import DataBinding from '../mixins/dataBinding';
//
// const styles = {
// 	root: {
// 		padding: '2px 0',
// 	}
// };
//
// const LabeledMultiCheckbox = React.createClass({
// 	mixins: [DataBinding],
//
// 	propTypes: {
// 		options: React.PropTypes.array,
// 	},
//
// 	getDefaultProps() {
// 		return {
// 			name: '',
// 			label: '名称',
// 	    value: '',
// 			vertical: false,
// 			optionsVertical: false,
// 			options: [],
// 		};
// 	},
//
// 	render() {
// 		let {value, label, vertical, style, name, options, optionsVertical, dataInputs, data, ...props} = this.props;
//
// 		let labelStyle = {};
// 		if(vertical){
// 			labelStyle.display = 'block';
// 		}
//
// 		let labelElem = null;
// 		if(label){
// 			labelElem = <lable className="FormLabel" style={labelStyle}>{label}</lable>;
// 		}
//
// 		if(dataInputs && data){
//       if(data.value){
//         var val = this._getValue(dataInputs, data.value);
//         if(!_.isNil(val)){
//           value = val;
//         }
//       }
// 		}
//
// 		var checkboxes = [], checked, optVal;
// 		options.forEach(function(opt, i){
// 			optVal = opt.value - 0;
// 			if(isNaN(optVal)){
// 				checked = opt.value === value;
// 			} else {
// 				checked = value & Math.pow(2, optVal);
// 			}
// 			checkboxes.push(
// 				<Checkbox name={name} label={opt.text} value={opt.value} checked={checked}
// 					inline={!optionsVertical} key={i}
// 					onChange={this._handleChange}/>
// 			);
// 		});
//
// 		return (
// 			<div style={style}>
// 				{labelElem}
// 				{checkboxes}
// 			</div>
// 		);
// 	},
//
// 	_handleChange(value, oldValue, e) {
// 		var {dataInputs, data} = this.props;
//     if(data.value){
// 			;
// 			var input = this._findDataInput(dataInputs, data.value);
// 			if(input){
//         input.value = this._getValueForType(input, value);
// 				Actions.valueChange();
// 			}
//     }
// 	},
// });
//
// export default LabeledMultiCheckbox;
//
// const options = {
// 	name: 'LabeledMultiCheckbox',
// 	attributes: {
// 		name: '',
// 		label: '名称',
// 		vertical: false,
// 		optionsVertical: false,
// 		options: [{text: '1', value: 1}, {text: '2', value: 2}],
// 		style: {
// 		},
// 		data: {
// 			value: '',
// 			// expression: '',
// 			hidden: '',
// 			onChange: '',//function name
// 		},
// 		//内置属性，用来设置属性的特殊属性 editor, hidden
// 		_options: {
// 			vertical: {
// 				editor: {type: 'checkbox'},
// 			},
// 			optionsVertical: {
// 				editor: {type: 'checkbox'},
// 			},
// 			style: {
// 				keyEditable: true,
// 				defaultChild: {'':''},
// 			},
// 			options: {
// 				defaultChild: {
// 					text: '', value: '',
// 					_options: {
// 						text: {
// 							editor: {autofocus: true}
// 						}
// 					},
// 				},
// 				//childOptions
// 				childName: 'option',
// 			},
// 			data: {
// 				hidden: true,
// 			},
// 		},
// 	},
// };
//
// export {options};
