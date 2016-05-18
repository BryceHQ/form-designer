import React from 'react';
import _ from 'lodash';

import form from './components/form';

import helper from './helper';

import Constants from './constants/constants';

const styles = {
  Row: {
    paddingLeft: '40px',
  },
};

/*
* parse data to get the form with drag and drop warpper.
*
* @param parent 当前parse的data的上一级
* @param json 当前parse的data
* @param rowDraggable row是否可以拖拽
* @param row 行号
* @param col 列号
* @param selectKey 当前选中的col的key
*/
function parse(parent, json, rowDraggable, selectKey, row, col){
  if(typeof json === 'string') return json;
  if(!json || !json.name) return;

  if(json.name === 'Row' && rowDraggable){
    ensureKey(json);
    return React.createElement(form.DragDrop, {
      key: json.attributes.key,
      parent: parent,
      row: row,
      col: col,
      target: json,
      style: styles.Row,
    }, [parse(parent, json, false, selectKey, row, col)]);
  }

  var children;
  if(json.name === 'Row'){
     children = _.map(json.children, function(child, index){
      ensureKey(child);
      return parse(json, child, rowDraggable, selectKey, row, index);
    });
  } else if(json.name === 'Form'){
    children = _.map(json.children, function(child, index){
      ensureKey(child);
      return parse(json, child, rowDraggable, selectKey, index, col);
    });
  } else {
    children = _.map(json.children, function(child, index){
      ensureKey(child);
      return parse(json, child, rowDraggable, selectKey, row, col);
    });
  }

  var attributes = _.assign({}, json.attributes, {
    target: json,
    parent: parent,
    row: row,
    col: col,
    selectKey,
  });
  //children.length ? children : null 对于不能有子节点的元素，react使用 children === null 来判断，否则抛出异常
  return React.createElement(form[json.name] || json.name, attributes, children.length ? children : null);
}


/*
* 如果child.attributes不包含key/uniqueKey属性，那么为她生成一个。
*/
function ensureKey(child){
  if(typeof child === 'object'){
    var key = helper.guid();
    if(!child.attributes) {
      child.attributes = {key: key};
      child.attributes.uniqueKey = key;
    } else if(!child.attributes.key){
      child.attributes.key = key;
      child.attributes.uniqueKey = key;
    }
  }
}

export default parse;
