import Constants from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import Store from './store.js';

import helper from '../helper.js';

let _form = {
  name: 'Form',
  attributes: {
    title: '',
  },
  children: [],
};

var formStore = {
  data: _form,

  // init(config) {
  // },
  add: add,
  save(callback) {
    save(null,callback);
  },

  get(fileId, callback) {
    if(fileId !== _presentation.fileId){
      _presentation.loading = true;
      get(fileId, callback);
    }
  },

  changeMode: changeMode,

  contentChange(content, callback) {
    _presentation.slideGroup[_presentation.current].content = content;
    autoSave(null, callback);
  },


  toggleLeft(open) {
    if(_.isNil(open)){
      _presentation.leftOpen = !_presentation.leftOpen;
      return;
    }
    _presentation.leftOpen = !!open;
  },

  //overview
  reinsert({from, to}, callback) {
    let arr = _presentation.slideGroup;
    const val = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, val);
    _presentation.current = to;

    autoSave(null, callback);
  },

  selectSlide(index){
    _presentation.current = index;
  },

  addSlide(callback){
    _presentation.slideGroup.splice(++_presentation.current, 0, {
      transition: 'fade',
      content: lang.default,
      key: guid(),
    });

    autoSave(null, callback);
  },

  removeSlide(callback){
    //There is one slide at least
    if(_presentation.slideGroup.length === 1) return;
    _presentation.slideGroup.splice(_presentation.current, 1);
    if(_presentation.current > 0){
      _presentation.current--;
    }

    autoSave(null, callback);
  },

  //slide
  next() {
    if(_presentation.current < _presentation.slideGroup.length - 1 ){
      _presentation.current += 1;
      return true;
    }
  },

  pre() {
    if(_presentation.current > 0){
      _presentation.current -= 1;
      return true;
    }
  },

};

export default formStore;
