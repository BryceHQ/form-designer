import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const EditableText = React.createClass({
  propTypes: {
    value: React.PropTypes.string,
    className: React.PropTypes.string,
  },

  getInitialState() {
    return {
      editing: false,
      value: this.props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.state.value){
      this.setState({
        value: nextProps.value
      });
    }
  },

  componentDidUpdate() {
    if(this.state.editing){
      ReactDOM.findDOMNode(this).focus();
    }
  },

	render() {
    var {editing, value} = this.state;
    var {className} = this.props;
    var cla = classNames(
		   'editable-text',
		   className,
       {input: editing}
		);
    if(editing){
      return (
        <input className={cla} onChange={this._handleChange} onBlur={this._handleBlur} value={value}>
        </input>
      );
    }else {
      return (
        <span className={cla} onClick={this._handleClick}>
          {value}
        </span>
      );
    }
	},

  _handleClick() {
    this.oldValue = this.state.value;
    this.setState({editing: true});
    if(this.props.onStartEdit){
      this.props.onStartEdit.call(this, this.state.value);
    }
  },

  _handleBlur() {
    this.setState({editing: false});
    if(this.props.onEndEdit){
      this.props.onEndEdit.call(this, this.state.value, this.oldValue);
    }
  },

  _handleChange(e) {
    this.setState({
      value: e.target.value || ''
    });
  },
});

export default EditableText;
