/*
* app 入口
*
*/
import React from 'react';
import _ from 'lodash';

import Snackbar from 'material-ui/lib/snackbar';
import CircularProgress from 'material-ui/lib/circular-progress';

import Store from '../stores/store';
import Actions from '../actions/actions';

import Constants, {Mode} from '../constants/constants';

import AppBar from './appbar';
import LeftBar from './leftbar';
import Toolbar from './toolbar';
import Main from './main';
import ErrorDialog from './error';

const App = React.createClass({
  getInitialState() {
    return Store.getData();
  },

  componentDidMount() {
    Store.addChangeListener(this._onChange);
    window.addEventListener("keydown", this._handleKeyDown);
  },
  componentWillUnmount() {
    Store.removeChangeListener(this._onChange);
    window.removeEventListener('keydown', this._handleKeyDown);
  },

  render() {
    let {form, mode, property, title, loading, menu, selectKey, bottomMessage, error} = this.state;
    let snackbar = (
      <Snackbar
        open={!!bottomMessage}
        message = {bottomMessage || ''}
        autoHideDuration={2000}
        onRequestClose={() => Actions.clearMessage()}
      />
    );

    let errorElem = null;
    if(error){
      errorElem = (
        <ErrorDialog error={error} onClearError={() => Actions.clearError()}/>
      );
    }
    let center;
    if(loading === true){
      center = (
        <div className="progress">
          <CircularProgress />
        </div>
      );
    } else{
      center = (
        <Main data={form} mode={mode} property={property}
          selectKey={selectKey}/>
      );
    }

    return (
      <div>
        <AppBar title={title} form={form}>
          <LeftBar open={mode.equalTo(Mode.MENU)} menu={menu} />
        </AppBar>
        {center}
        {errorElem}
        {snackbar}
      </div>
    );
  },

  _onChange() {
    this.setState(Store.getData());
  },

  _handleKeyDown(e) {
    var keyCode = e.keyCode;
    var {mode} = this.state;
    if(!mode.equalTo(Mode.NORMAL)){
      switch (keyCode) {
        case 27: //esc
          Actions.changeMode();
          e.preventDefault();
          break;
        default:
          break;
      }
      return;
    }
    switch (keyCode) {
      case 46:// Delete
        Actions.remove();
        e.preventDefault();
        break;
      case 33: // pg up
      case 37: // left
      case 38: // up
        break;
      case 32: // space
      case 34: // pg down
      case 39: // right
      case 40: // down
        //Actions.slide.next();
        //break;
      case 79:
        // overView();
      case 9: // tab
        //Actions.toggleRight();
        break;
      default:
        break;
    }
  },

});

export default App;
