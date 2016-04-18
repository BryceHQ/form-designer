import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Validatable from '../mixins/validatable';

const styles = {
	root: {
		padding: '2px 0',
    display: 'inline',
	}
};

const Textbox = React.createClass({
	mixins: [Validatable],

	propTypes: {
	},

	getDefaultProps() {
		return {
			type: 'text',
			placeholder: '请输入...',
			required: false,
	    requiredMessage: '该项为必填项',
	    rule: '',
	    invalidMessage: '请输入有效值',
	    value: '',
		};
	},

	getInitialState() {
		return {
			isValid: true,
	    value: this.props.value || '',
		};
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.value !== this.state.value){
			var nextState = {value: nextProps.value};
			this.validateValue(nextProps.value, nextState);
			this.setState(nextState);
		}
	},

	validateValue(value, nextState){
		var {rule} = this.props;
		var valid, type = typeof rule;
		if(type === 'function'){
			valid = rule(value);
		} else if(rule ==='string'){
			valid = this.validate(rule, value);
		}
		if(typeof valid === 'boolean'){
			nextState.isValid = valid;
      return;
		}
		if(valid){
			nextState.isValid = valid.isValid;
			this.props.invalidMessage = valid.message;
		}
	},

	_handleChange(e) {
		var value = e.target.value;
		var nextState = {value};
		this.validateValue(value, nextState);
		if(this._debouncedChange){
			this._debouncedChange(value, this.state.value);
		}

		this.setState(nextState);

    if(this.props.owner && this.props.target){
      this.props.owner[this.props.target] = value || '';
    }
	},

	componentDidMount () {
		if (this.props.autofocus) {
			this.focus();
		}
    if(this.props.onChange){
      this._debouncedChange = _.debounce(this.props.onChange, 1000);
    }
	},

	focus() {
		this.refs.input.focus();
	},

	render() {
		let {noedit, multiline, className, style, required, placeholder, invalidMessage, requiredMessage} = this.props;
		let {isValid, value} = this.state;
		// classes
		let newClass = classnames(
			{
				'FormInput-noedit': noedit,
				'FormInput-noedit--multiline': noedit && multiline,
				'FormInput': !noedit
			},
			className
		);
		let rootClass = classnames(
			{
				'is-invalid': !isValid || required && !value
			}
		);


		let Element = 'input';
		if (noedit) {
			Element = 'div';
			props.type = null;
			props.children = props.children || props.value;
		} else if (multiline) {
			Element = 'textarea';
		}

		let requiredMessageElem = null;
		if(required && !value){
			requiredMessageElem = (
				<div className="form-validation">
          {requiredMessage}
        </div>
			);
		}

    let validationMessageElem = null;
		if(!isValid){
			validationMessageElem = (
				<div className="form-validation">
          {invalidMessage}
        </div>
			);
		}

		return (
			<div className={rootClass} style={styles.root}>
				<Element className={newClass} ref="input" value={value} placeholder={placeholder} onChange={this._handleChange}/>
				{requiredMessageElem}
				{validationMessageElem}
			</div>
		);
	}
});

export default Textbox;
