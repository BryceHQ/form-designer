import Constants from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import Store from './store.js';

import helper from '../helper.js';

import FormElement from '../core/formElement.js';

//**不应该直接引用这个文件，破坏了依赖关系。store不依赖components**
import colOptions from '../components/form/options/col.js';

let _form = new FormElement('Form');

var _drag;
var _selected = [];

/*
* extend FormElement
*/
FormElement.prototype.isSelected = function() {
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
          result = new FormElement('Row');
          result.addChild(target);
          break;
        default:
          result = new FormElement('Col', _.cloneDeep(colOptions));
          result.addChild(target);
          target = result;
          result = new FormElement('Row');
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
          result = new FormElement('Col', _.cloneDeep(colOptions));
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
  getData() {
    return _form;
  },

  setData(data) {
    _form = data;
  },

  createControl(type, data, parent) {
    return new FormElement(type, data, parent);
  },

  startDrag(data) {
    _drag = data;
  },

  endDrag(target) {
    if(!_drag) return;

    //remove
    if(_.isNil(target)){
      _drag.remove();
      _selected.length = 0;
      return;
    }

    //拖拽到它自己上，直接返回
    if(target === _drag) return;

    var dragTarget;
    if(typeof _drag.getType === 'function'){
      dragTarget = _drag;
    } else {
      dragTarget = new FormElement(_drag.name, _.cloneDeep(_drag));
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

  select(formElement, singleSelect){
    if(singleSelect === true){
      _selected.length = 0;
    }
    _selected.push(formElement);
  },

  remove(formElements){
    if(!formElements){
      formElements = _selected.splice(0, _selected.length);
    }
    if(!formElements.length){
      formElements.remove();
      return;
    }
    formElements.forEach(element => element.remove());
  },

  getSelected(){
    return _selected;
  },

};

export default formStore;
