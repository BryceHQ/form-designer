import React from 'react';
import classnames from'classnames';
import _ from 'lodash';

import Colors from 'material-ui/lib/styles/colors';

import Title from './title';
import Editor from './editor';
import Field from './field';

import Actions from '../../actions/actions';

const styles = {
  title: {
    padding: '2px',
    backgroundColor: Colors.grey200,
    border: '1px solid #c1dce9',
    position: 'relative',
    marginBottom: '0.25em',
    lineHeight: '20px',
    borderRadius: '3px',
  },
};

const CollapsableField = React.createClass({
  getDefaultProps() {
    return {
      hiddenKeys: ['key', '_options'],
    };
  },

  getInitialState() {
    return {
      collaped: false,
    };
  },

  /* 检验属性是否显示
  * hidden为object时，{
  *   targetName: 'type',
  *   targetValues: ['a', 'b']
  * }
  * 适用于 当前属性是否显示取决于同级的另一个属性。如果这个属性为某些特定的值，那么当前属性显示。
  */
  _isHidden(hidden, data){
    if(typeof hidden !== 'object') return hidden;


    for(var key in data){
      if(!data.hasOwnProperty(key)) continue;
      if(key === hidden.targetName){
        if(_.isArray(hidden.targetValues)){
          return !~hidden.targetValues.indexOf(data[key]);
        } else {
          return data[key] !== hidden.targetValues;
        }
      }
    }
  },

  render() {
    var {data, options, title, onAddChild, onRemoveChild, style, formatter, hiddenKeys} = this.props;
    var {collaped} = this.state;

    var elems = [];
    if(!data){
      return <Field/>;
    }

    var index = 0;

    if(title){
      elems.push(
        <Title text = {title} key = {index++} style={styles.title}
          data = {data}
          addable = {options && options.addable}
          removable = {options && options.removable}
          collaped = {collaped}
          onTouchTap = {this._handleClick}
        />
      );
    }
    var _options = data._options || {};
    //data = _.omit(data, this.props.hiddenKeys);
    var opt;
    if(!collaped){
      for(var key in data){
        if(!data.hasOwnProperty(key) || ~hiddenKeys.indexOf(key)) continue;
        opt = _options[key];
        if(typeof data[key] === 'object'){
          elems.push(
            <CollapsableField data = {data[key]} options={opt} key = {index++}
              title = {formatter ? formatter(key) : key}
              formatter = {this.props.formatter}
              onChange = {this.handleChange}
              onBeforeChange = {this.handleBeforeChange}
              removable = {data.variableChildren}
              onRemove = {this._onHandleRemove}
              />
          );
          continue;
        }
        if(this._isHidden(opt && opt.hidden, data) === true) continue;

        elems.push(
          <Field label={formatter ? formatter(key) : key} key = {index++}
            editable={options && options.keyEditable}
            owner={data}
            >
            <Editor
              onChange = {this._handleChange}
              autofocus = {data.autofocus}
              {...(opt && opt.editor)}
              owner = {data}
              target = {key}
              value = {data[key]}
              />
          </Field>
        );
      }
    }

    var rootStyle = {
      marginLeft: title ? '0.5em' : 0,
    };
    return (
      <div style = {_.assign(rootStyle, style)}>
        {elems}
      </div>
    );
  },

  _onHandleAdd() {
    Actions.addChild(this.props.data);
  },

  _onHandleRemove(index) {
    Actions.removeChild(this.props.data, index);
  },

  _handleClick() {
    this.setState({collaped: !this.state.collaped});
  },

  _handleChange(value, oldValue) {
    Actions.valueChange();
  },
});

export default CollapsableField;
