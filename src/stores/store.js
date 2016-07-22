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
  leftOpen: false,
  rightOpen: false,
  rightData: null,
  loading: false,
  mode: Mode.NORMAL,
  bottomMessage: null,
  error: null,
  menu: menuStore.data,
  title: '测试表单',
  selectKey: '',
  form: {
    name: 'Form',
    attributes: {
      title: '',
      dataInputs: [],
      _options: {
  			dataInputs: {
  				defaultChild: {
            name: '', type: '', defaultValue: '',
            _options: {
              name: {
                editor: {autofocus: true}
              },
              type: {
                editor: {
        					type: 'combobox',
        					options: [{
                    text: '字符串', value: 'string'
                  },{
                    text:'数值', value:'int'
                  },{
                    text: '布尔值', value: 'bool',
                  },{
                    text: '日期', value: 'datetime',
                  }]
        				}
              },
            }
          },
  				//childOptions
  				childName: 'input',
  			},
  		},
    },
    children: [],
  },
};

let _drag = {};

/*
* 对当前的target进行转换
*/
function getTarget(target, name, attrs) {
  if(target.name === name) return target;
  // Row的child一定是Col
  if(name === 'children'){
    return target.name === 'Row' ? target.children : target;
  }
  return _.assign({name: name}, {children: [target], attributes: attrs});
}

/*
* 特殊的array splice方法，values可以为数组。
*/
function splice(array, index, deleteCount, values){
  if(values.length){
    var args = [index, deleteCount];
    args = args.concat(values);
    Array.prototype.splice.apply(array, args);
    return;
  }
  array.splice(index, deleteCount, values);
}

/*
* 当row的children中为1时，直接移除该row
*/
function removeChild(target, index, parentIndex){
  if(!target)return;
  var array = target.children;
  if(array.length === 1){
    _data.form.children.splice(parentIndex, 1);
    return;
  }
  array.splice(index, 1);
}

function endDrag({target, parent, row, col}){
  if(!_drag.target) return;

  var inner = typeof _drag.col === 'number';

  //remove
  if(_.isNil(target)){
    removeChild(_drag.parent, inner ? _drag.col : _drag.row, _drag.row);
    return;
  }


  //将某个Row拖拽到它自己上，直接返回
  var rowObj = inner ? _drag.parent : _drag.target;
  if(row === _drag.row && typeof row !== 'undefined' && rowObj.name === 'Row') return;

  var dragTarget = _drag.isCloneTarget ? _.cloneDeep(_drag.target) : _drag.target;

  removeChild(_drag.parent, inner ? _drag.col : _drag.row, _drag.row);
  //target Col
  if(typeof col === 'number'){
    splice(parent.children, col, 0, getTarget(dragTarget, 'children'));
  }
  //target row
  else {
    if(!inner && parent){
      target = parent;
    }
    if(typeof row === 'number'){
      if(inner){
        splice(target.children, row, 0, getTarget(dragTarget, 'children'));
      } else {
        splice(target.children, row, 0, getTarget(dragTarget, 'Row'));
      }
    } else {
      target.children.push(getTarget(dragTarget, 'Row'));
    }
  }

}

function preview(callback){
  if(_config.preview){
    var form = _.cloneDeepWith(_data.form, function(value, key){
      if(key && typeof key === 'string' && key.indexOf('_') === 0){
        return null;
      }
    });
    var inputNames = [], inputTypes = [];
    ajax.post(
      _config.preview, {
        data: {json: JSON.stringify(form), dataInputs: JSON.stringify(form.attributes.dataInputs), id: _config.id},
        success(data) {
          if(!data) return;
          window.open(_config.preview + '/' + data);
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
    var form = _data.form;
    var inputNames = [], inputTypes = [];
    form.attributes.dataInputs.forEach(function(input){
      if(input.name){
        inputNames.push(input.name);
        inputTypes.push(input.type);
      }
    });
    ajax.post(
      _config.save, {
        data: {json: JSON.stringify(form), isDeploy, isNewVersion, dataInputs: JSON.stringify(form.attributes.dataInputs), id: _config.id},
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
      data.attributes.dataInputs.forEach(function(input){
        if(!input || !input.name) return;
        input.value = initData[input.name];
      });
      _data.form = data;
      this.emitChange();
    }
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
    //---------------drag------------------
    case Constants.START_DRAG:
      _.assign(_drag, action.data);

      if(action.data.isCloneTarget === true){
        _data.mode = Mode.DRAG + '.' + Mode.DRAG_KIT;
      } else {
        _data.mode = Mode.DRAG;
      }
      Store.emitChange();
      break;

    case Constants.END_DRAG:
      if(action.data !== false){
        endDrag(action.data);
      }

      _data.mode = Mode.NORMAL;

      Store.emitChange();
      break;

    case Constants.SELECT:
      _data.selectKey = action.data.key;
      if(_data.rightOpen === true){
        _data.rightData = action.data.data;
      }
      Store.emitChange();
      break;

    //----------property------------
    case Constants.ADD_CHILD:
      var target = action.data.parent;
      var child = _.assign({}, action.data.child);
      if(_.isArray(target)){
        target.push(child);
      } else {
        _.assign(target, child);
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
    case Constants.VALUE_CHANGE:
      Store.emitChange();
      break;


    case Constants.TOGGLE_LEFT:
      _data.leftOpen = !_data.leftOpen;
      menuStore.select(null, _callback, true);
      Store.emitChange();
      break;

    case Constants.TOGGLE_RIGHT:
      _data.rightOpen = !!action.data.open;
      _data.rightData = action.data.data;
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
    _data.error = data.message;
    Store.emitChange();
  },
};


export default Store;
