import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Checkbox from '../common/editor/checkbox';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledCheckbox = React.createClass({

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
		};
	},

	render() {
		let {label, vertical, style, name, options, optionsVertical} = this.props;
		let props = _.omit(this.props, ['label', 'vertical', 'style', 'options', 'optionsVertical']);

		let labelStyle = {};
		if(vertical){
			labelStyle.display = 'block';
		}


		let labelElem = null;
		if(label){
			labelElem = <lable className="FormLabel" style={labelStyle}>{label}</lable>;
		}

		var checkboxes = [];
		options.forEach(function(opt, i){
			checkboxes.push(
				<Checkbox name={name} label={opt.text} value={opt.value} inline={!optionsVertical} key={i}/>
			);
		});

		return (
			<div style={style}>
				{labelElem}
				{checkboxes}
			</div>
		);
	}
});

export default LabeledCheckbox;

const options = {
	name: 'LabeledCheckbox',
	attributes: {
		name: '',
		label: '名称',
		vertical: false,
		optionsVertical: false,
		options: [{text: 'click here', value: 'here'}, {text: 'click there', value: 'there'}],
		style: {
			color: 'red',
		},
		//内置属性，用来设置属性的特殊属性 editor, hidden
		_options: {
			vertical: {
				editor: {type: 'checkbox'},
			},
			optionsVertical: {
				editor: {type: 'checkbox'},
			},
			style: {
				keyEditable: true,
				defaultChild: {'':''},
			},
			options: {
				defaultChild: {text: '', value: ''},
				//childOptions
				childName: 'option',
			},
		},
	},
};

export {options};
