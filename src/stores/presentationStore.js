import Constants from '../constants/constants.js';
import _ from 'lodash';

import history from '../history.js';

import ajax from '../ajax.js';
import lang from '../lang.js';

import Store from './store.js';

import helper from '../helper.js';

const MODE = Constants.MODE;

let _lastMode = MODE.PRESENTATION;

let _readme = {
  fileId: 'readme',
  title: 'readme',
  background: '',
  duang: 'left',
  slideGroup: [{
    transition: 'bounce',
    content: '# 快捷键 \n - F11: 全屏切换 \n - i: 进入编辑 \n - Esc: 退出编辑 \n - Space/右/下: 下一页 \n - 左/上: 上一页 \n - Tab: 切换导航栏 \n\n## 切换：bounce',
    key: '1',
    duang: 'left',
  }, {
    transition: 'fade',
    content: '# 幻灯片编辑 \n - 目前仅支持使用markdown进行编辑 \n - 左侧展开后，可以添加，删除某页幻灯片，拖拽可以改变幻灯片的顺序。\n\n## 切换：fade',
    key: '2',
    duang: 'right',
  }, {
    transition: 'slideRight',
    content: '### Inspired by impress.js \n ## 切换：slideRight',
    key: '3',
    duang: 'vague',
  }, {
    transition: 'slideUp',
    content: '### powered by React and Meterial UI \n ## 切换：slideUp',
    key: '4',
    duang: 'clear',
  }, {
    transition: 'zoom',
    content: '### powered by react-motion \n ## 切换：zoom',
    key: '5',
  }, {
    transition: 'flash',
    content: '## 切换：flash',
    key: '6',
  }, {
    transition: 'flip',
    content: '## 切换：flip',
    key: '7',
  }, {
    transition: 'rotate',
    content: '## 切换：rotate',
    key: '8',
  }, {
    transition: 'roll',
    content: '## 切换：roll',
    key: '9',
  }]
};

let _presentation = _.assign({
  rightOpen: false,
  leftOpen: false,
  loading: false,
  mode: MODE.PRESENTATION,// markdown, presentation, uploading
  current: 0,
}, _readme);

let _reset = {
  rightOpen: false,
  leftOpen: false,
  mode: MODE.PRESENTATION,
  current: 0,
  loading: false,
};

//helper
function guid() {
  return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);
}

function changeMode(mode) {
  mode = mode || _lastMode;
  _lastMode = _presentation.mode;
  _presentation.mode = mode;
}

function get(fileId, callback){
  if(fileId === 'readme'){
    _.assign(_presentation, _readme, _reset);
    Store.emitChange();
    return;
  }
  var config = Store.getConfig();
  ajax.get(
    config.get,{
      data: {id: fileId},
      success(data) {
        if(!data) return;
        _.assign(_presentation, {
          fileId: data.id,
          slideGroup: JSON.parse(data.raw),
          title: data.name,
          background: data.background,
        }, _reset);

        Store.emitChange();
      },
      error(data) {
        // _presentation.loading = false;
        callback.error(data);
      },
    }
  );
}

//新增
function add(callback){
  var config = Store.getConfig();
  if(config){
    var me = this;
    ajax.post(
      config.add,{
        success(data) {
          if(!data) return;
          history.to(`/file/${data}`);
        },
        error(data) {
          callback.error(data);
        },
      }
    );
  }
}

//更新presetation中任意属性的值
function save(data, callback){
  var config = Store.getConfig();
  data = data || {raw: JSON.stringify(_presentation.slideGroup), id: _presentation.fileId, background: _presentation.background};
  ajax.post(
    config.save, {
      data: data,
      success(data) {
        if(data === null || typeof data === 'undefined') return;
        callback.success(data);
      },
      error(data){
        callback.error(data);
      },
    }
  );
}

//只更新presentation.raw
var autoSave = _.debounce(save, 3000);

var presentationStore = {
  data: _presentation,

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

  transitionChange(transition, callback) {
    _presentation.slideGroup[_presentation.current].transition = transition;
    autoSave(null, callback);
  },

  duangChange(duang, callback) {
    _presentation.slideGroup[_presentation.current].duang = duang;
    autoSave(null, callback);
  },

  titleChange(title, callback) {
    _presentation.title = title;
    changeMode(_lastMode);
    save({name: title, id: _presentation.fileId}, callback);
  },

  //sidebar
  toggleRight(open) {
    if(open === null || typeof open === 'undefined'){
      return _presentation.rightOpen = !_presentation.rightOpen;
    }
    _presentation.rightOpen = !!open;
  },

  toggleLeft(open) {
    if(open === null || typeof open === 'undefined'){
      return _presentation.leftOpen = !_presentation.leftOpen;
    }
    _presentation.leftOpen = !!open;
  },

  //fullscreen
  fullscreen() {
    if(_presentation.mode === MODE.FULLSCREEN){
      _presentation.mode = _lastMode;
      _lastMode = MODE.FULLSCREEN;
    }
    else{
      _lastMode = _presentation.mode;
      _presentation.mode = MODE.FULLSCREEN;
      _presentation.bottomMessage = lang.message.fullscreen;
    }
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

  //upload
  setBackground(url, callback){
    _presentation.slideGroup[_presentation.current].background = url;

    autoSave(null, callback);
  },

  setDefaultBackground(url, callback){
    _presentation.background = url;

    autoSave(null, callback);
    // Store.setMessage(lang.message.successOperate);
  },
};

export default presentationStore;
