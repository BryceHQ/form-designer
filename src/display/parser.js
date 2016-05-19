import React from 'react';
import _ from 'lodash';

import form from '../components/form/display';

import helper from '../helper';

/*
* parse data to get the form itselt.
*
* @param json 当前parse的data
* @param dataInputs
*/
function parseForm(json, dataInputs, emitChange){
  if(typeof json === 'string') return json;
  if(!json || !json.name) return;

  var children;
  children = _.map(json.children, function(child, index){
    ensureKey(child);
    return parseForm(child, dataInputs, emitChange);
  });

  json.attributes = _.assign(json.attributes || {}, {
    dataInputs,
    emitChange,
  });

  //children.length ? children : null 对于不能有子节点的元素，react使用 children === null 来判断，否则抛出异常
  return React.createElement(form[json.name] || json.name, json.attributes, children.length ? children : null);
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

export default parseForm;
