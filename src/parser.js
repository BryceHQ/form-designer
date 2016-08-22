import React from 'react';

import form from './components/form';

import helper from './helper';

import Constants from './constants/constants';

/*
* parse data to get the form with drag and drop warpper.
*
* @param parent 当前parse的data的上一级
* @param json 当前parse的data
*/
function parse(json){
  if(typeof json === 'string') return json;
  if(!json || !json.name) return;

  var children = [];
  json.getChildren().forEach((child, index) => {
    ensureKey(child.getData());
    children.push(parse(child));
  });

  var attributes = Object.assign({},
    json.getData().attributes,
    {target: json}
  );
  //children.length ? children : null 对于不能有子节点的元素，react使用 children === null 来判断，否则抛出异常
  return React.createElement(form[json.name] || json.name, attributes, children.length ? children : null);
}

/*
* 如果child.attributes不包含key/uniqueKey属性，那么为她生成一个。
*/
function ensureKey(data){
  if(typeof data === 'object'){
    if(!data.attributes) {
      data.attributes = {};
    }
    if(!data.attributes.key){
      var key = helper.guid();
      data.attributes.key = key;
      data.attributes.uniqueKey = key;
    }
  }
}

export default parse;
