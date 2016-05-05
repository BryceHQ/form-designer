import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

var Radio = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		inline: React.PropTypes.bool,
		label: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			inline: true,
		};
	},

	getInitialState() {
		return {
			value: _.isNil(this.props.value) ? '' : this.props.value,
		};
	},

	componentDidMount () {
		if (this.props.autofocus) {
			this.focus();
		}
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.value !== this.state.value){
			this.setState({value: nextProps.value});
		}
	},

	focus() {
		this.refs.radio.focus();
	},

	render() {
    var {label, className, inline, ...props} = this.props;
		var {value} = this.state;
		var componentClass = classnames('x-radio-container', className);

    var style = {
      display: inline ? 'inline-block' : 'block',
    };

		return (
			<label className={componentClass} style={style}>
				<input {...props} type="radio" className="x-radio" value={value} onChange={this._handleChange}/>
				{label && <span className="x-radio-label">{label}</span>}
			</label>
		);
	},

	_handleChange(e) {
		var flag;
		var value = e.target.value;
		if(this.props.onBeforeChange){
			flag = this.props.onBeforeChange(value, this);
		}
		if(flag === false) return;

		if(this.props.onChange){
			this.props.onChange(value, this.state.value);
		}

		this.setState({value});

		if(this.props.owner && this.props.target){
			this.props.owner[this.props.target] = value;
		}
	},

});

export default Radio;
