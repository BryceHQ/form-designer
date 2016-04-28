const constants = {

  //---------------user------------------
  START_DRAG: 'START_DRAG',
  END_DRAG: 'END_DRAG',

  //---------------property------------------
  ADD_CHILD: 'ADD_CHILD',
  REMOVE_CHILD: 'REMOVE_CHILD',

  //---------------presentation------------------
  ADD: 'ADD',
  SAVE: 'SAVE',

  CHANGE_MODE: 'CHANGE_MODE',
  CONTENT_CHANGE: 'CONTENT_CHANGE',
  TITLE_CHANGE: 'TITLE_CHANGE',
  VALUE_CHANGE: 'VALUE_CHANGE',
  TOGGLE_LEFT: 'TOGGLE_LEFT',
  TOGGLE_RIGHT: 'TOGGLE_RIGHT',
  //overview
  REINSERT: 'REINSERT',

  //---------------menu------------------
  MENU_SELECT: 'MENU_SELECT',

  //---------------message------------------
  SET_MESSAGE: 'SET_MESSAGE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const mode = {
  NORMAL: 'normal',
  DRAG: 'drag',
  EDITING: 'editing',
};


export default constants;
export {mode as Mode};
