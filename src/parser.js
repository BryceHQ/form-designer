import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

import form from './components/form';

import helper from './helper';

import Constants from './constants/constants';

const styles = {
  Row: {
    paddingLeft: '40px',
  },

};

/*
* @param parent
* @param json
* @param rowDraggable
* @param colDraggable
* @param row
* @param col
*/
function parser(parent, json, rowDraggable, colDraggable, row, col){
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
    }, [parser(parent, json, false, colDraggable, row, col)]);
  }

  if(json.name === 'Col' && colDraggable){
    ensureKey(json);

    return React.createElement(form[json.name] || json.name, json.attributes,
      [
        parser(parent, {
          name: 'DragDrop',
          attributes: {
            key: json.attributes.key,
            parent: parent,
            row: row,
            col: col,
            target: json,
          },
          children: json.children,
        }, rowDraggable, false, row, col)
      ]
    );
  }

  var children;
  if(json.name === 'Row'){
     children = _.map(json.children, function(child, index){
      if(typeof child === 'string'){
        return child;
      }
      ensureKey(child);
      return parser(json, child, rowDraggable, colDraggable, row, index);
    });
  } else {
    children = _.map(json.children, function(child, index){
      if(typeof child === 'string'){
        return child;
      }
      ensureKey(child);
      return parser(json, child, rowDraggable, colDraggable, index, col);
    });
  }

  //children.length ? children : null 对于不能有子节点的元素，react使用 children === null 来判断，否则抛出异常
  return React.createElement(form[json.name] || json.name, json.attributes, children.length ? children : null);
}

function ensureKey(child){
  var key = helper.guid();
  if(!child.attributes) {
    child.attributes = {key: key};
    child.attributes.uniqueKey = key;
  } else if(!child.attributes.key){
    child.attributes.key = key;
    child.attributes.uniqueKey = key;
  }
}

export default parser;
