import React from 'react';
import classnames from 'classnames';

import Checkbox from '../common/editor/checkbox';

import DataBinding from '../mixins/dataBinding';

const styles = {
	root: {
		padding: '2px 8px',
	}
};

const LabeledCheckbox = function(container) {
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
				on: true,
				off: false,
				vertical: false,
				optionsVertical: false,

				basic: '20%',
			};
		},

		render() {
			let {
				value, vertical, dataInputs, data, style, containerStyle,
				parent, target, col, row, basis, uniqueKey, selectKey,
				...props
			} = this.props;

			style = Object.assign(styles.root, style);
			// labelStyle = Object.assign({}, labelStyle);
			containerStyle = Object.assign({}, containerStyle);
			
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

			var children = [];
			children.push(
				<Checkbox {...props} name={name} value={value} inline={!vertical} onChange={this._handleChange} style={style} key="editor"/>
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
};

export default LabeledCheckbox;
