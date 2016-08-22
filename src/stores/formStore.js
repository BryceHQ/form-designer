import Constants from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import Store from './store.js';

import helper from '../helper.js';

import Control from './control.js';

let _form = new Control('Form');

var _drag;
var _selected = [];


/*
* extend Control
*/
Control.prototype.isSelected = function() {
  return ~_selected.indexOf(this);
};


function getTarget(target, name){
  if(target.name === name){
    return target;
  }
  var result;
  switch (name) {
    case 'Row':
      switch (target.name) {
        case 'Col':
          result = new Control('Row');
          result.addChild(target);
          break;
        default:
          result = new Control('Col');
          result.addChild(target);
          target = result;
          result = new Control('Row');
          result.addChild(target);
          break;
      }
      break;
    case 'Col':
      switch (target.name) {
        case 'Row':
          result = target.getChildren();
          break;
        default:
          result = new Control('Col');
          result.addChild(target);
          break;
      }
      break;
    default:
      break;
  }
  return result;
}

var formStore = {
  data: _form,

  createControl(type, parent, data) {
    return new Control(type, parent, data);
  },

  startDrag(data) {
    _drag = data;
  },

  endDrag(target) {
    if(!_drag) return;

    //remove
    if(_.isNil(target)){
      _drag.remove();
      return;
    }

    //拖拽到它自己上，直接返回
    if(target === _drag) return;

    var dragTarget ;
    if(typeof _drag.getType === 'function'){
      dragTarget = _drag;
    } else {
      dragTarget = new Control(_drag.name, null, _.cloneDeep(_drag.target));
    }
    dragTarget.remove();
    //target Col
    if(target.name === 'Col'){
      target.parent.addChild(getTarget(dragTarget, 'Col'), target.getIndex());
    }
    else if(target.name === 'Row'){
      target.addChild(getTarget(dragTarget, 'Col'));
    } else {
      target.addChild(getTarget(dragTarget, 'Row'));
    }
  },

  select(control, singleSelect){
    if(singleSelect === true){
      _selected = [control];
    } else {
      _selected.push(control);
    }
  },

  getSelected(){
    return _selected;
  },
};

export default formStore;
