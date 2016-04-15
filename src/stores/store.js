import Dispatcher from '../dispatcher/dispatcher.js';
import { EventEmitter } from 'events';
import Constants from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import helper from '../helper.js';

import userStore from './userStore.js';
import presentationStore from './presentationStore.js';
import menuStore from './menuStore.js';

const CHANGE_EVENT = 'change';

let _config = {};

let _data = {
  presentation: presentationStore.data,
  user: userStore.data,
  menu: menuStore.data,
};

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
      if(_config.user){
        userStore.init(_config.user);
      }
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
    if(fileId){
      presentationStore.get(fileId, _callback);
      menuStore.reset();
      Store.emitChange();
    }
    return _data;
  },

  getUser() {
    return userStore.data;
  },

  isAuthenticated() {
    return userStore.data.isAuthenticated;
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
    //---------------user------------------
    case Constants.SIGN_IN:
      userStore.signIn(action.data);
      Store.emitChange();
      break;

    case Constants.LOGOUT:
      userStore.logout(_callback);
      break;

    case Constants.UPDATE_USER:
      userStore.update(action.data, _callback);
      break;

    //---------------presentation------------------
    case Constants.ADD:
      presentationStore.add(_callback);
      break;

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

    case Constants.TRANSITION_CHANGE:
      presentationStore.transitionChange(action.data, _callback);
      Store.emitChange();
      break;

    case Constants.DUANG_CHANGE:
      presentationStore.duangChange(action.data, _callback);
      Store.emitChange();
      break;

    case Constants.TITLE_CHANGE:
      presentationStore.titleChange(action.data, _callback);
      break;


    case Constants.TOGGLE_LEFT:
      presentationStore.toggleLeft(action.data);
      menuStore.select(null, _callback, true);
      Store.emitChange();
      break;

    case Constants.TOGGLE_RIGHT:
      presentationStore.toggleRight(action.data);
      Store.emitChange();
      break;

    case Constants.TOGGLE_FULLSCREEN:
      presentationStore.fullscreen();
      Store.emitChange();
      break;

    //overview
    case Constants.REINSERT:
      presentationStore.reinsert(action.data, _callback);
      Store.emitChange();
      break;

    case Constants.SELECT_SLIDE:
      presentationStore.selectSlide(action.data);
      Store.emitChange();
      break;
    case Constants.ADD_SLIDE:
      presentationStore.addSlide(_callback);
      Store.emitChange();
      break;
    case Constants.REMOVE_SLIDE:
      presentationStore.removeSlide(_callback);
      Store.emitChange();
      break;


    //slide
    case Constants.SLIDE.NEXT:
      if(presentationStore.next() === true){
        Store.emitChange();
      }
      break;

    case Constants.SLIDE.PRE:
      if(presentationStore.pre() === true){
        Store.emitChange();
      }
      break;


    //---------------upload------------------
    case Constants.SET_BACKGROUND:
      presentationStore.setBackground(action.data, _callback);
      Store.emitChange();
      break;
    case Constants.SET_DEFAULT_BACKGROUND:
      presentationStore.setDefaultBackground(action.data, _callback);
      Store.emitChange();
      break;


    //---------------menu------------------
    case Constants.MENU_SELECT:
      menuStore.select(action.data, _callback);
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
    debuger;
    _data.error = data.message;
    Store.emitChange();
  },
};


export default Store;
