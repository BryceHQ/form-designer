import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants.js';

const Action = {
  //---------------user------------------
  //sign
  signIn(data) {
    if(!data) return;
    Dispatcher.dispatch({
      actionType: Constants.SIGN_IN,
      data: data,
    });
  },

  logout() {
    Dispatcher.dispatch({
      actionType: Constants.LOGOUT,
    });
  },

  updateUser(data) {
    if(!data) return;
    Dispatcher.dispatch({
      actionType: Constants.UPDATE_USER,
      data: data,
    });
  },

  //---------------presentation------------------
  //add
  add(callback){
    Dispatcher.dispatch({
      actionType: Constants.ADD,
      data: { callback: callback },
    });
  },

  //save
  save(){
    Dispatcher.dispatch({
      actionType: Constants.SAVE,
    });
  },

  changeMode(mode, withoutEmit) {
    Dispatcher.dispatch({
      actionType: Constants.CHANGE_MODE,
      data: {mode: mode, withoutEmit},
    });
  },

  contentChange(content) {
    Dispatcher.dispatch({
      actionType: Constants.CONTENT_CHANGE,
      data: content,
    });
  },

  transitionChange(transition) {
    Dispatcher.dispatch({
      actionType: Constants.TRANSITION_CHANGE,
      data: transition,
    });
  },

  duangChange(duang) {
    Dispatcher.dispatch({
      actionType: Constants.DUANG_CHANGE,
      data: duang,
    });
  },

  titleChange(title) {
    Dispatcher.dispatch({
      actionType: Constants.TITLE_CHANGE,
      data: title || '',
    });
  },

  toggleLeft(data) {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_LEFT,
      data: data,
    });
  },

  toggleRight(data) {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_RIGHT,
      data: data,
    });
  },

  //fullscreen
  toggleFullscreen() {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_FULLSCREEN,
    });
  },

  //overview
  reinsert(from, to) {
    Dispatcher.dispatch({
      actionType: Constants.REINSERT,
      data: {from: from, to: to},
    });
  },
  selectSlide(index) {
    Dispatcher.dispatch({
      actionType: Constants.SELECT_SLIDE,
      data: index,
    });
  },
  addSlide() {
    Dispatcher.dispatch({
      actionType: Constants.ADD_SLIDE,
    });
  },
  removeSlide() {
    Dispatcher.dispatch({
      actionType: Constants.REMOVE_SLIDE,
    });
  },

  //slide
  slide: {
    next() {
      Dispatcher.dispatch({
        actionType: Constants.SLIDE.NEXT
      });
    },
    pre() {
      Dispatcher.dispatch({
        actionType: Constants.SLIDE.PRE
      });
    },
  },

  //---------------upload------------------
  setBackground(url){
    if(!url) return;
    Dispatcher.dispatch({
      actionType: Constants.SET_BACKGROUND,
      data: url,
    });
  },

  setDefaultBackground(url){
    if(!url) return;
    Dispatcher.dispatch({
      actionType: Constants.SET_DEFAULT_BACKGROUND,
      data: url,
    });
  },

  //---------------menu------------------
  menuSelect(index) {
    Dispatcher.dispatch({
      actionType: Constants.MENU_SELECT,
      data: index,
    });
  },


  //---------------message------------------
  setMessage(message) {
    Dispatcher.dispatch({
      actionType: Constants.SET_MESSAGE,
      data: message,
    });
  },
  clearMessage() {
    Dispatcher.dispatch({
      actionType: Constants.CLEAR_MESSAGE
    });
  },
  setError(error) {
    Dispatcher.dispatch({
      actionType: Constants.SET_ERROR,
      data: error,
    });
  },
  clearError() {
    Dispatcher.dispatch({
      actionType: Constants.CLEAR_ERROR
    });
  },
};

export default Action;
