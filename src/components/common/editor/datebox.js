import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import DatePicker from 'react-datepicker';
import moment from'moment';

require('react-datepicker/dist/react-datepicker.css');

var Datebox = React.createClass({

  getInitialState() {
    return {
      value: this._getDate(this.props.value),
    };
  },

	componentWillReceiveProps(nextProps) {
		if(nextProps.value !== this.state.value){
			this.setState({value: nextProps.value});
		}
		if(nextProps.onChange !== this.props.onChange){
			this._debouncedChange = _.debounce(this.props.onChange, 1000);
		}
	},

	componentDidMount () {
    if(this.props.onChange){
      this._debouncedChange = _.debounce(this.props.onChange, 1000);
    }
	},

  render() {
    var {className, placeholder, todayButton, ...props} = this.props;
    var {value} = this.state;
    todayButton = todayButton === true ? 'today' : null;
    var componentClass = classnames('FormInput', className);
    return (
      <DatePicker {...props} className={componentClass}
        locale="zh-cn"
        selected={value}
        todayButton={todayButton}
        placeholderText={placeholder}
        onChange={this._handleChange} />
    );
  },

  _getDate(value) {
    if(_.isDate(value)) return value;
    if(_.isString(value)){
      var date = moment(value);
      if(date.isValid()){
        return date;
      }
    }
    return null;
  },

	_handleChange(value) {
		var flag;
		if(this.props.onBeforeChange){
			flag = this.props.onBeforeChange(value, this);
		}
		if(flag === false) return;

		if(this._debouncedChange){
			this._debouncedChange(value, this.state.value);
		}

		this.setState({value});

		if(this.props.owner && this.props.target){
			this.props.owner[this.props.target] = value;
		}
	},
});

export default Datebox;
