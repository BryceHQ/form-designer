import React from 'react';
import _ from 'lodash';

import Actions from '../actions/actions';

import Constants from '../constants/constants';

import Store from '../stores/store';

import Right from './right';
import Left from './left';

const Center = React.createClass({
  // componentDidMount() {
  //   window.addEventListener("keydown", this._handleKeyDown);
  //   window.addEventListener("keyup", this._handleKeyUp);
  // },
  //
  // componentWillUnmount() {
  //   window.removeEventListener('keydown', this._handleKeyDown);
  //   window.removeEventListener('keyup', this._handleKeyUp);
  // },

  render() {
    // let {index, mode, data} = this.props;

    return (
      <div className = "center" style = {this.props.style}>
        <Right></Right>
        <Left></Left>
      </div>
    );
  },


  // _handleKeyDown(e) {
  //   var {mode} = this.props;
  //   var keyCode = e.keyCode;
  //   if(keyCode === 83 && e.ctrlKey && mode !== Constants.MODE.FULLSCREEN){
  //     // Ctrl + S
  //     Actions.save();
  //     e.stopPropagation();
  //     return e.preventDefault();
  //   }
  //   if(mode === Constants.MODE.MARKDOWN){
  //     if(keyCode === 27){
  //       //esc退出markdown编辑模式
  //       Actions.changeMode(Constants.MODE.PRESENTATION);
  //     }
  //     return;
  //   }
  //   if(mode === Constants.MODE.PRESENTATION && keyCode === 73){
  //     Actions.changeMode(Constants.MODE.MARKDOWN);
  //     return;
  //   }
  //   if( (mode === Constants.MODE.PRESENTATION || mode === Constants.MODE.FULLSCREEN) &&
  //     (keyCode === 9 || keyCode === 79 || keyCode === 27 ||
  //       ( keyCode >= 32 && keyCode <= 34) ||
  //       (keyCode >= 37 && keyCode <= 40)
  //     ) ) {
  //     switch (keyCode) {
  //       case 33: // pg up
  //       case 37: // left
  //       case 38: // up
  //         Actions.slide.pre();
  //         break;
  //       case 32: // space
  //       case 34: // pg down
  //       case 39: // right
  //       case 40: // down
  //         Actions.slide.next();
  //         break;
  //       case 79:
  //         // overView();
  //       case 27: //esc
  //         break;
  //       case 9: // tab
  //         Actions.toggleRight();
  //         break;
  //     }
  //
  //     e.preventDefault();
  //   }
  // },

  /*
  * 当全屏后，在按F11，keydown事件捕获不到。
  */
  // _handleKeyUp(e) {
  //   var {mode} = this.props;
  //   var keyCode = e.keyCode;
  //
  //   if( (mode === Constants.MODE.PRESENTATION || mode === Constants.MODE.FULLSCREEN) &&
  //     keyCode === 122 // F11
  //   ) {
  //       Actions.toggleFullscreen();
  //   }
  // },
});


export default Center;
