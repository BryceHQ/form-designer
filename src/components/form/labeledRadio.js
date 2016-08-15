import React from 'react';
import classnames from 'classnames';

import Radio from '../common/editor/radio';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledRadio = function(container){
	return React.createClass({
		mixins: [DataBinding, container],

		propTypes: {
			options: React.PropTypes.array,
		},

		getDefaultProps() {
			return {
				name: '',
				label: '名称',
		    value: '',
				vertical: false,
				optionsVertical: false,
				options: [],

				basis: '20%',
			};
		},

		render() {
			let {
				value, label, vertical, style, options, optionsVertical, dataInputs, data,
				containerStyle, labelStyle,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			if(vertical){
				labelStyle.display = 'block';
			}
			var children = [];
			if(label){
				children.push(
					<lable className="FormLabel" style={labelStyle} key="label">{label}</lable>
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

			var me = this;
			options.forEach(function(opt, i){
				children.push(
					<Radio name={name} label={opt.text} value={opt.value} checked={opt.value === value}
						inline={!optionsVertical} key={i}
						onChange = {me._handleChange}/>
				);
			});

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

		_handleChange(value) {
			var {data, dataInputs} = this.props;
	    if(data.computed) return;
	    if(data.name){
				dataInputs[data.name] = this._getValueForType(data.type, value);
				if(this.props.emitChange){
					this.props.emitChange();
				}
	    }
		},
	});
};

export default LabeledRadio;
