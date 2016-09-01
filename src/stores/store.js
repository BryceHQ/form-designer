import Dispatcher from '../dispatcher/dispatcher.js';
import { EventEmitter } from 'events';
import Constants, {Mode as ConstantsMode} from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import helper from '../helper.js';

import Mode from '../core/mode.js';

import menuStore from './menuStore.js';
import formStore from './formStore.js';

const CHANGE_EVENT = 'change';

let _config = {
  preview: '/json',
};

let _data = {
  property: null,
  loading: false,
  mode: new Mode(ConstantsMode.NORMAL),
  bottomMessage: null,
  error: null,
  menu: menuStore.data,
  title: '测试表单',
  selectKey: '',
  form: formStore.getData(),
};

let _drag = {};


function preview(callback){
  if(_config.preview){
    var form = formStore.getData().toJson();
    form = _.cloneDeepWith(form, function(value, key){
      if(key && typeof key === 'string' && key.indexOf('_') === 0){
        return null;
      }
    });
    var dataInputs = getDataInputs(form);
    ajax.post(
      _config.preview, {
        data: {
          json: JSON.stringify(form),
          dataInputs: JSON.stringify(dataInputs),
          id: _config.id
        },
        success(data) {
          if(!data) return;
          //window.open(_config.preview + '/' + data);
          window.open('/preview');
        },
        error(data) {
          callback.error(data);
        },
      }
    );
  }
}

function save(isDeploy, isNewVersion, callback){
  if(_config.save){
    var form = formStore.getData().toJson();
    form = _.cloneDeepWith(form, function(value, key){
      if(key && typeof key === 'string' && key.indexOf('_') === 0){
        return null;
      }
    });
    var dataInputs = getDataInputs(form);
    ajax.post(
      _config.save, {
        data: {
          json: JSON.stringify(form), isDeploy, isNewVersion,
          dataInputs: JSON.stringify(dataInputs),
          id: _config.id
        },
        success(data) {
          if(!data) return;
          callback.success(data);
        },
        error(data) {
          callback.error(data);
        },
      }
    );
  }
}

function getDataInputs(form){
  if(!form) return;
  var results = [];
  var flag = {};
  parseChildren(form.children);
  return results;

  function parseChildren(children){
    if(!children || !children.length) return;
    children.forEach(function(child){
      if(!child) return;
      if(child.attributes && child.attributes.data){
        var data = child.attributes.data;
        if(data.name){
          if(data.computed === false){
            parseData(data, child.attributes.label);
          } else if(_.isNil(data.computed)){
            var {startData, endData} = data;
            if(startData && startData.computed === false){
              parseData(startData);
            }
            if(endData && endData.computed === false){
              parseData(endData);
            }
          }
        }
      }
      parseChildren(child.children);
    });
  }

  function parseData(data, displayName){
    if(flag[data.name] === true){
      throw new Error('data inputs name duplicate');
    }
    flag[data.name] = true;
    results.push({
      name: data.name,
      type: data.type,
      defaultValue: data.defaultValue,
      displayName: displayName || data.displayName,
    });
  }
}

function setMode(mode){
  mode = mode || ConstantsMode.NORMAL;
  if(typeof mode === 'string'){
    _data.mode = new Mode(mode);
  } else {
    _data.mode = mode;
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

  setForm(data, initData) {
    if(data){
      _data.form = data;
      this.emitChange();
    }
  },

  setMode: setMode,

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
    //---------------drag------------------
    case Constants.START_DRAG:
      formStore.startDrag(action.data.target);
      //_.assign(_drag, action.data);

      setMode(ConstantsMode.DRAG + '.' + (action.data.source || ''));
      Store.emitChange();
      break;

    case Constants.END_DRAG:
      if(action.data !== false){
        formStore.endDrag(action.data);
      }

      setMode();

      Store.emitChange();
      break;

    case Constants.SELECT:
      var target = action.data.data;
      if(_data.mode.equalTo(ConstantsMode.PROPERTY)){
        _data.property = target.getProperty();
      }
      formStore.select(target, action.data.singleSelect);
      Store.emitChange();
      break;

    case Constants.REMOVE:
      formStore.remove(action.data);
      Store.emitChange();
      break;

    //----------property------------
    case Constants.ADD_CHILD:
      var target1 = action.data.parent;
      var child = _.assign({}, action.data.child);
      if(_.isArray(target1)){
        target.push(child);
      } else {
        _.assign(target1, child);
      }

      Store.emitChange();
      break;

    case Constants.REMOVE_CHILD:
      var {parent, index} = action.data;
      if(_.isArray(parent)){
        parent.splice(index, 1);
      } else {
        delete parent[index];
      }

      Store.emitChange();
      break;

    case Constants.SAVE:
      var {isDeploy, isNewVersion} = action.data;
      save(isDeploy, isNewVersion, _callback);
      break;

    case Constants.PREVIEW:
      preview();
      break;

    // case Constants.CONTENT_CHANGE:
    //   presentationStore.contentChange(action.data, _callback);
    //   break;
    //
    // case Constants.TITLE_CHANGE:
    //   presentationStore.titleChange(action.data, _callback);
    //   break;
    //

    case Constants.CHANGE_MODE:
      setMode(action.data.mode);
      Store.emitChange();
      break;

    case Constants.VALUE_CHANGE:
      Store.emitChange();
      break;

    case Constants.TOGGLE_LEFT:
      if(_data.mode.equalTo(ConstantsMode.NORMAL)){
        setMode(ConstantsMode.MENU);
      } else {
        setMode(ConstantsMode.NORMAL);
      }
      menuStore.select(null, _callback, true);
      Store.emitChange();
      break;

    case Constants.TOGGLE_RIGHT:
      if(_data.mode.equalTo(ConstantsMode.NORMAL)){
        setMode(ConstantsMode.PROPERTY);
      } else {
        setMode(ConstantsMode.NORMAL);
      }
      _data.property = action.data.data;
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
    _data.bottomMessage = data.message || lang.message.successSave;
    Store.emitChange();
  },

  error(data) {
    if(data.message){
      _data.error = data.message;
      Store.emitChange();
    }
  },
};


export default Store;
