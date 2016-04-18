import React from 'react';
import classnames from'classnames';

import Colors from 'material-ui/lib/styles/colors';

import Title from './title';
import Editor from './editor';
import Field from './field';

import Actions from '../../actions/actions';

const styles = {

  title: {
    padding: '2px',
    backgroundColor: Colors.lightGreen100,
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
      hiddenKeys: ['key'],
    };
  },

  render() {
    var {data, addable, title, onAddChild, onRemoveChild, style, formatter, hiddenKeys} = this.props;

    var elems = [];
    if(!data){
      return <Field/>;
    }

    var index = 0;

    //style.marginLeft = '1em' if !style.marginLeft
    if(title){
      elems.push(
        <Title text = {title} key = {index++} style={styles.title}
          data = {data}
          addable = {true}
          removable = {true}
          collaped = {false}
          onClick = {this._onHandleClick}
        />
      );
    }

    for(var key in data){
      if(!data.hasOwnProperty(key) || ~hiddenKeys.indexOf(key)) continue;
      if(typeof data[key] === 'object'){
        elems.push(
          <CollapsableField data = {data[key]} key = {index++}
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
      elems.push(
        <Field label={formatter ? formatter(key) : key} key = {index++}>
          <Editor
            onChange = {this._handleChange}
            autofocus = {data.autofocus}
            {...data.editor}
            owner = {data}
            target = {key}
            value = {data[key]}
            />
        </Field>
      );
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

  _onHandleClick() {
    Actions.toggleCollape(this.props.data);
  },

  _handleChange(value, oldValue) {
    Actions.valueChange();
  },
});

export default CollapsableField;
