import Constants from '../constants/constants.js';
import _ from 'lodash';

import ajax from '../ajax.js';
import lang from '../lang.js';

import Store from './store.js';
import Actions from '../actions/actions.js';

import helper from '../helper.js';

var message = lang.message;

let _data = {
  current: 2,
  history: [],
  recent: [],
  historyFlag: true,
  recentFlag: true,
};

var menuStore = {
  data: _data,

  // init(config) {
  //   _.assign(_user, _.pick(config, ['id', 'name', 'description', 'isAuthenticated']));
  // },

  select(index, callback, withoutEmit) {
    index = index || _data.current;
    switch (index) {
      case 1: //new
        Actions.add();
        break;
      case 2: //open
        if(_data.recentFlag){
          recent(callback);
        }
        break;
      case 3: //download
        break;
      case 4: //history
        if(_data.historyFlag){
          history(callback);
        }
        break;
      default:
        break;
    }
    if(withoutEmit !== true){
      Store.emitChange();
    }
    _data.current = index;
  },

  reset(history = true, recent = true){
    _data.historyFlag = true;
    _data.recentFlag = true;
    _data.current = 2;
  },
};


//历史记录
function history(callback){
  var config = Store.getConfig();
  var presentation = Store.getData().presentation;
  if(config){
    ajax.get(
      config.history, {
        data: {id: presentation.fileId},
        success(data) {
          if(!data) return;
          _data.history = formatHistory(data);
          _data.historyFlag = false;

          _data.placeholder = message.nothing;

          Store.emitChange();
        },
        error(data) {
          callback.error(data);
        },
      }
    );

    _data.placeholder = message.loading;
  }
}

//最近的文件
function recent(callback){
  var config = Store.getConfig();
  var user = Store.getData().user;
  if(config){
    ajax.get(
      config.recent, {
        data: {userId: user.id},
        success(data) {
          if(!data) return;
          _data.recent = formatRecent(data);
          _data.recentFlag = false;

          _data.placeholder = message.nothing;

          Store.emitChange();
        },
        error(data) {
          callback.error(data);
        },
      }
    );
    _data.placeholder = message.loading;
  }
}

function formatHistory(data){
  if(!data.length) return;
  return _.map(data, function(item){
    return {
      id: item.id,
      name: message.history(item.createTime),
      value: message.historyHint,
    };
  });
}


function formatRecent(data){
  if(!data.length) return;
  return _.map(data, function(item){
    return {
      id: item.id,
      name: item.name,
      value: item.lastUpdateTime,
    };
  });
}

export default menuStore;
