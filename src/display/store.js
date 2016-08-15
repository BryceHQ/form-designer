import { EventEmitter } from 'events';

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
      _data.form = data;
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

export default Store;
