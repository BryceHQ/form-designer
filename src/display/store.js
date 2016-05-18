import { EventEmitter } from 'events';
import _ from 'lodash';

const CHANGE_EVENT = 'change';

let _data = {
};

const Store = _.assign({}, EventEmitter.prototype, {
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
      data.attributes.dataInputs.forEach(function(input){
        if(!input || !input.name) return;
        input.value = initData[input.name];
      });
      _data.form = data;
      this.emitChange();
    }
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

export default Store;
