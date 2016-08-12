import Dispatcher from '../dispatcher/dispatcher.js';
import Constants from '../constants/constants.js';

const Action = {
  //---------------form------------------
  //Drag
  startDrag(data) {
    Dispatcher.dispatch({
      actionType: Constants.START_DRAG,
      data: data,
    });
  },

  endDrag(data) {
    Dispatcher.dispatch({
      actionType: Constants.END_DRAG,
      data: data,
    });
  },

  //select highlight
  select(data) {
    Dispatcher.dispatch({
      actionType: Constants.SELECT,
      data: data,
    });
  },

  preview() {
    Dispatcher.dispatch({
      actionType: Constants.PREVIEW,
    });
  },

  //---------------presentation------------------
  //addChild
  addChild(parent, child){
    Dispatcher.dispatch({
      actionType: Constants.ADD_CHILD,
      data: { parent: parent, child: child },
    });
  },
  removeChild(parent, index){
    Dispatcher.dispatch({
      actionType: Constants.REMOVE_CHILD,
      data: {parent: parent, index: index},
    });
  },

  //save
  save(isDeploy, isNewVersion){
    Dispatcher.dispatch({
      data: {isDeploy, isNewVersion},
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

  titleChange(title) {
    Dispatcher.dispatch({
      actionType: Constants.TITLE_CHANGE,
      data: title || '',
    });
  },

  valueChange() {
    Dispatcher.dispatch({
      actionType: Constants.VALUE_CHANGE,
    });
  },

  toggleLeft(data) {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_LEFT,
      data: data,
    });
  },

  toggleRight(open, data) {
    Dispatcher.dispatch({
      actionType: Constants.TOGGLE_RIGHT,
      data: {open: open, data: data},
    });
  },

  //overview
  reinsert(from, to) {
    Dispatcher.dispatch({
      actionType: Constants.REINSERT,
      data: {from: from, to: to},
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
