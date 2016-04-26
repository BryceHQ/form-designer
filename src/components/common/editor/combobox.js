import React from 'react';
import classnames from'classnames';
import _ from 'lodash';


const Combobox = React.createClass({
  getDefaultProps() {
    return {
      value: '',
    };
  },

  getInitialState() {
    return {
      value: this.props.value === null || typeof this.props.value === 'undefined' ? '' : this.props.value,
    };
  },

  componentDidMount() {
    if(this.props.autofocus){
      this.focus();
    }
    if(this.props.onChange){
      this._debouncedChange = _.debounce(this.props.onChange, 1000);
    }
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.state.value){
      this.setState({
        value: nextProps.value,
      });
    }

    if(nextProps.onChange !== this.props.onChange){
      this._debouncedChange = _.debounce(this.props.onChange, 1000);
    }
  },

  _handleChange(e) {
    var value = e.target.value;
    var flag;
    if(this.props.onBeforeChange){
      flag = this.props.onBeforeChange(value, this);
    }
    if(flag === false) return;

    this.setState({value});

    if(this._debouncedChange){
			this._debouncedChange(value, this.state.value);
		}

    if(this.props.owner && this.props.target){
      this.props.owner[this.props.target] = value || '';
    }
  },

  focus() {
    this.refs.select.focus();
  },

  render() {
    var {className} = this.props;

    var options = this.props.options || [];
    var optionElems = [];
    options.forEach(function(opt, i){
      optionElems.push(
        <option key = {i} value = {opt.value}>{opt.text}</option>
      );
    });

    var props = _.omit(this.props, ['className', 'value']);

    var componentClass = classnames("x-combobox", "FormInput", className);
    return (
      <select {...props} className = {componentClass}
        ref = "select"
        onChange = {this._handleChange}
        onDoubleClick = {this.props.onDoubleClick}
        onClick = {this.props.onClick}
        value = {this.state.value}>
        {optionElems}
      </select>
    );
  },
});

export default Combobox;
