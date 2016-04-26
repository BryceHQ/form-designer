import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Radio from '../common/editor/radio';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledRadio = React.createClass({

	propTypes: {
		options: React.PropTypes.array,
	},

	getDefaultProps() {
		return {
			type: 'text',
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
		let props = _.omit(this.props, ['label', 'vertical', 'style'])

		let labelStyle = {};
		if(vertical){
			labelStyle.display = 'block';
		}


		let labelElem = null;
		if(label){
			labelElem = <lable className="FormLabel" style={labelStyle}>{label}</lable>;
		}

		var radios = [];
		options.forEach(function(opt, i){
			radios.push(
				<Radio name={name} label={opt.text} value={opt.value} inline={!optionsVertical} key={i}/>
			);
		});

		return (
			<div style={style}>
				{labelElem}
				{radios}
			</div>
		);
	}
});

export default LabeledRadio;
