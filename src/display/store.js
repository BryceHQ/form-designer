import { EventEmitter } from 'events';

import FormElement from '../core/formElement.js';


const CHANGE_EVENT = 'change';

let _data = {
};

let _dataInputs = {

};

const Store = Object.assign({}, EventEmitter.prototype, {
  setConfig(config) {
    if(config){
      _config = config;
      // init other store
    }
  },

  getConfig(config) {
    return _config;
  },

  setData(data) {
    _data = data;
    this.emitChange();
  },

  getData(fileId) {
    return _data;
  },

  setForm(data, initData) {
    if(data){
      _dataInputs = initData;
      _data.form = new FormElement('Form');
      _data.form.fromJson(data);
      this.emitChange();
    }
  },

  getDataInputs() {
    return _dataInputs;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

window.display = Store;

export default Store;
