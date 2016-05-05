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
      value: _.isNil(this.props.value) ? '' : this.props.value,
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

  focus() {
    this.refs.select.focus();
  },

  render() {
    var {className, options, owner, target, ...props} = this.props;
    var {value} = this.state;
    options = options || [];
    var optionElems = [];
    options.forEach(function(opt, i){
      //当value不存在时，将其设置为第一个option
      if(i === 0 && (_.isNil(value) || value === '') ){
        value = opt.value;
        if(owner && target){
          owner[target] = value;
        }
      }
      optionElems.push(
        <option key = {i} value = {opt.value}>{opt.text}</option>
      );
    });

    var componentClass = classnames("x-combobox", "FormInput", className);
    return (
      <select {...props} className = {componentClass}
        ref = "select"
        onChange = {this._handleChange}
        onDoubleClick = {this.props.onDoubleClick}
        onClick = {this.props.onClick}
        value = {value}>
        {optionElems}
      </select>
    );
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
});

export default Combobox;
