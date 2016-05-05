import Dispatcher from '../dispatcher/dispatcher.js';
import { EventEmitter } from 'events';
import Constants, {Mode} from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import helper from '../helper.js';

import menuStore from './menuStore.js';

const CHANGE_EVENT = 'change';

let _config = {};

let _data = {
  loading: false,
  bottomMessage: null,
  error: null,
  form: {
    name: 'Form',
    attributes: {
      title: '',
      dataInputs: [],
    },
    children: [],
  },
};


function preview(){
  if(_config.preview){
    var form = _.cloneDeepWith(_data.form, function(value, key){
      if(key.indexOf('_') === 0){
        return null;
      } else {
        return value;
      }
    });
    ajax.post(
      _config.preview, {
        data: {json: JSON.stringify(form)},
        success(data) {
          if(!data) return;
          window.open(_config.preview + '?viewName=' + data);
        },
        error(data) {
          callback.error(data);
        },
      }
    );
  }
}

function setMessage(message){
  _data.bottomMessage = message;
}

function clearMessage(){
  _data.bottomMessage = null;
}

function setError(error){
  _data.error = error;
}

function clearError(){
  _data.error = null;
}


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

  setForm(form) {
    _data.form = form;
    this.emitChange();
  },

  setMessage: setMessage,

  setError: setError,

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


// Register callback to handle all updates
Dispatcher.register((action) => {
  switch (action.actionType) {
    case Constants.SAVE:
      presentationStore.save(_callback);
      break;

    case Constants.CHANGE_MODE:
      presentationStore.changeMode(action.data.mode);
      if(action.data.withoutEmit !== true){
        Store.emitChange();
      }
      break;

    case Constants.CONTENT_CHANGE:
      presentationStore.contentChange(action.data, _callback);
      break;

    case Constants.VALUE_CHANGE:
      Store.emitChange();
      break;

    //---------------message------------------
    case Constants.SET_MESSAGE:
      setMessage(action.data);
      Store.emitChange();
      break;
    case Constants.CLEAR_MESSAGE:
      clearMessage();
      Store.emitChange();
      break;

    case Constants.SET_ERROR:
      setError(action.data);
      Store.emitChange();
      break;
    case Constants.CLEAR_ERROR:
      clearError();
      Store.emitChange();
      break;

    default:
      break;
  }
});


var _callback = {
  /*
  * 成功消息和错误处理的回调函数
  *
  * @param data
  */
  success(data) {
    _data.bottomMessage = lang.message.successSave;
    Store.emitChange();
  },

  error(data) {
    _data.error = data.message;
    Store.emitChange();
  },
};


export default Store;
