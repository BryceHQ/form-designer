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

import Constants from '../constants/constants';

// Our custom react component
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
    let {form, mode, leftOpen, rightOpen, rightData, title, loading, menu, selectKey, bottomMessage, error} = this.state;
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
        <Main data={form} mode={mode} rightOpen={rightOpen} leftOpen={leftOpen} rightData={rightData}
          selectKey={selectKey}/>
      );
    }

    return (
      <div>
        <AppBar title={title} form={form}>
          <LeftBar open = {leftOpen} menu = {menu} />
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

    if(keyCode === 46) { // Delete
      Actions.;
    }
  },
});

export default App;
