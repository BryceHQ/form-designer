import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Textbox from '../common/textbox';

const styles = {
	root: {
		padding: '2px 0',
	}
};

const LabeledInput = React.createClass({

	propTypes: {
	},

	getDefaultProps() {
		return {
			type: 'text',
			label: '名称',
			placeholder: '请输入',
			required: false,
	    requiredMessage: '该项为必填项',
	    rule: '',
	    invalidMessage: '请输入有效值',
	    value: '',
		};
	},

	render() {
		let {label, vertical, style} = this.props;
		let props = _.omit(this.props, ['label', 'vertical', 'style'])

		let labelStyle = {};
		if(vertical){
			labelStyle.display = 'block';
		}


		let labelElem = null;
		if(label){
			labelElem = <lable className="FormLabel" style={labelStyle}>{label}</lable>;
		}

		return (
			<div style={style}>
				{labelElem}
				<Textbox {...props} onChange={this.props.onChange}/>
			</div>
		);
	}
});

export default LabeledInput;
