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
      hiddenKeys: ['key', 'uniqueKey', '_options'],
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
    var {data, options, title, removable, style, formatter, hiddenKeys, onRemove} = this.props;
    var {collaped} = this.state;

    var elems = [];
    if(!data) return (<Field/>);

    var index = 0;

    if(title){
      elems.push(
        <Title text = {title} key = {index++} style={styles.title}
          index={this.props.index}
          data={data}
          addable={options && options.defaultChild}
          removable={removable}
          collaped={collaped}
          onTouchTap={this._handleClick}
          onAdd={this._handleAdd}
          onRemove={onRemove || this._handleRemove}
        />
      );
    }

    var _options = data._options || {};
    //data = _.omit(data, this.props.hiddenKeys);
    var opt;
    if(!collaped){
      if(_.isArray(data)){
        var me = this;
        data.forEach(function(item, i){
          elems.push(
            <CollapsableField data = {item} options={options && options.childOptions} key = {index++}
              title={formatter ? formatter(options && options.childName) : options && options.childName}
              removable={options && options.defaultChild}
              index={i}
              formatter={me.props.formatter}
              onRemove={me._handleRemove}
            />
          );
        });
      } else {
        for(var key in data){
          if(!data.hasOwnProperty(key) || ~hiddenKeys.indexOf(key)) continue;
          opt = _options[key];

          if(opt && opt.template){
            if(data.name){
              var compiled = _.template(opt.template);
              data[key] = compiled(data);
            } else {
              data[key] = '';
            }
          }

          if(this._isHidden(opt && opt.hidden, data) === true) continue;

          if(typeof data[key] === 'object'){
            elems.push(
              <CollapsableField data={data[key]} options={opt} key={index++}
                title={formatter ? formatter(key) : key}
                index={key}
                formatter={this.props.formatter}
              />
            );
            continue;
          }

          elems.push(
            <Field label={formatter ? formatter(key) : key} key = {index++}
              editable={options && options.keyEditable}
              owner={data}
              index={key}
              onRemove={this._handleRemove}
            >
              <Editor
                onChange={this._handleChange}
                {...(opt && opt.editor)}
                owner={data}
                target={key}
                value={data[key]}
              />
            </Field>
          );
        }
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

  _handleAdd() {
    Actions.addChild(this.props.data, this.props.options.defaultChild);
  },

  _handleRemove(index) {
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
