/*
* 显示一个 file
*
*/
import React from 'react';
import _ from 'lodash';

import Snackbar from 'material-ui/lib/snackbar';
import CircularProgress from 'material-ui/lib/circular-progress';

import Store from '../stores/store.js';
import Actions from '../actions/actions.js';

import Constants from '../constants/constants.js';

// Our custom react component
import AppBar from './appbar.jsx';
import Right from './right.jsx';
import Left from './left.jsx';
import SlideGroup from './slideGroup.jsx';
import ErrorDialog from './error.jsx';


const SimpleFile = React.createClass({
  getInitialState() {
    return Store.getData(this.props.params.fileId);
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.params.fileId !== nextProps.params.fileId){
      Store.getData(nextProps.params.fileId);
    }
  },

  componentDidMount() {
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount() {
    Store.removeChangeListener(this._onChange);
  },

  render() {
    let {presentation, menu, user, bottomMessage, error} = this.state;
    let {slideGroup, current, mode, leftOpen, rightOpen, title, loading, background} = presentation;
    let snackbar = (
      <Snackbar
        open={!!bottomMessage}
        message = {bottomMessage || ''}
        autoHideDuration={2000}
        onRequestClose={() => Actions.clearMessage()}
      />
    );
    //全屏
    if(mode === Constants.MODE.FULLSCREEN){
      return (
        <div>
          <SlideGroup data = {slideGroup} index = {current} mode = {mode} background = {background}
            style = {{
              top: '0px',
            }}/>
          {snackbar}
        </div>
      );
    }

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
        <SlideGroup data = {slideGroup} index = {current} mode = {mode} background = {background}/>
      );
    }

    return (
      <div>
        <AppBar mode = {mode} user = {user} simple = {false} title={title}>
          <Right open = {rightOpen} data = {slideGroup} current = {current}/>
          <Left open = {leftOpen} menu = {menu} user = {user}/>
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
});

export default SimpleFile;
