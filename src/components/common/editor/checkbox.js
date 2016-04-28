import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

const Checkbox = React.createClass({
    getDefaultProps() {
      return {
        on: true,
        off: false,
        inline: true,
      };
    },
    getInitialState() {
      return {
        value: this.props.value || '',
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
      var flag,
        value = e.target.checked ? this.props.on : this.props.off;
      if(this.props.onBeforeChange){
        flag = this.props.onBeforeChange(value, this.oldValue);
      }
      if(flag === false) return;

      this.oldValue = this.state.value;
      this.setState({value});

      if(this._debouncedChange){
  			this._debouncedChange(value, this.state.value);
  		}

      if(this.props.owner && this.props.target){
        this.props.owner[this.props.target] = value;
      }
    },

    focus() {
      this.refs.input.focus();
    },


    render() {
      var {label, className, inline, on} = this.props;
  		var componentClass = classnames('x-checkbox-container', className);
  		var props = _.omit(this.props, 'className', 'label', 'inline', 'on', 'off');
      var style = {
        display: inline ? 'inline-block' : 'block',
      };

      var value = this.state.value || '';

  		return (
  			<label className={componentClass} style={style}>
  				<input {...props} type="checkbox" className="x-checkbox"
            ref = "input"
            checked = {value === on || value.toLowerCase() == on}
            value = {value} onChange = {this._handleChange}/>
  				{label && <span className="x-checkbox-label">{label}</span>}
  			</label>
  		);
    },

});

export default Checkbox;
