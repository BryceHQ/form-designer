import React from 'react';
import _ from 'lodash';

import Slide from './slide.jsx';
import Markdown from './markdown.jsx';
import Background from './background.jsx';

import UploadWindow from './uploadWindow.jsx';

import Actions from '../actions/actions.js';


import Constants from '../constants/constants.js';

import Store from '../stores/store.js';


const SlideGroup = React.createClass({
  componentDidMount() {
    window.addEventListener("keydown", this._handleKeyDown);
    window.addEventListener("keyup", this._handleKeyUp);
  },

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);
  },

  render() {
    let {index, mode, data} = this.props;
    index = index || 0;
    let slide = data[index];
    let {transition, style, content, key, background, duang} = slide;
    background = background || this.props.background;

    var upload = null;
    if(mode === Constants.MODE.UPLOADING){
      upload = <UploadWindow open={true}></UploadWindow>;
    }

    if(mode === Constants.MODE.MARKDOWN){
      return (
        <div className = "slideGroup" style = {this.props.style}>
          <div key={key} className="slideItem" style={style}>
            {upload}
            <Markdown mode={mode} content={content} index={index} transition={transition} duang={duang || this.props.duang || 'gradient left'}></Markdown>
          </div>
        </div>
      );
    }

    var backgroundElem = null;
    if(background !== null && typeof background !== 'undefined'){
      //duang || this.props.duang || 'left' 临时处理， 应在后端实现
      backgroundElem = (<Background url={background} duang={duang || this.props.duang || 'gradient left'}></Background>);
    }

    function renderSlideItem(key, styleResolved){
      return (
        <div key={key} className="slideItem" style={_.assign(style, styleResolved)}>
          {backgroundElem}
          {upload}
          <Markdown mode={mode} content={content} index={index} transition={transition}></Markdown>
        </div>
      );
    }

    return (
      <div className = "slideGroup" style = {this.props.style}>
        <Slide transition={transition} uniqueKey={key} mode={mode}>
          {
            (styleResolver, interpolatedStyles) => {
              return (
                <span>
                  {
                    interpolatedStyles.map(config => {
                      return renderSlideItem(config.key, styleResolver(config.style));
                    })
                  }
                </span>
              );
            }
          }
        </Slide>
      </div>
    );
  },

  updateCode (newCode) {
		this.setState({
			code: newCode
		});
	},


  _handleKeyDown(e) {
    var {mode} = this.props;
    var keyCode = e.keyCode;
    if(keyCode === 83 && e.ctrlKey && mode !== Constants.MODE.FULLSCREEN){
      // Ctrl + S
      Actions.save();
      e.stopPropagation();
      return e.preventDefault();
    }
    if(mode === Constants.MODE.MARKDOWN){
      if(keyCode === 27){
        //esc退出markdown编辑模式
        Actions.changeMode(Constants.MODE.PRESENTATION);
      }
      return;
    }
    if(mode === Constants.MODE.PRESENTATION && keyCode === 73){
      Actions.changeMode(Constants.MODE.MARKDOWN);
      return;
    }
    if( (mode === Constants.MODE.PRESENTATION || mode === Constants.MODE.FULLSCREEN) &&
      (keyCode === 9 || keyCode === 79 || keyCode === 27 ||
        ( keyCode >= 32 && keyCode <= 34) ||
        (keyCode >= 37 && keyCode <= 40)
      ) ) {
      switch (keyCode) {
        case 33: // pg up
        case 37: // left
        case 38: // up
          Actions.slide.pre();
          break;
        case 32: // space
        case 34: // pg down
        case 39: // right
        case 40: // down
          Actions.slide.next();
          break;
        case 79:
          // overView();
        case 27: //esc
          break;
        case 9: // tab
          Actions.toggleRight();
          break;
      }

      e.preventDefault();
    }
  },
  /*
  * 当全屏后，在按F11，keydown事件捕获不到。
  */
  _handleKeyUp(e) {
    var {mode} = this.props;
    var keyCode = e.keyCode;

    if( (mode === Constants.MODE.PRESENTATION || mode === Constants.MODE.FULLSCREEN) &&
      keyCode === 122 // F11
    ) {
        Actions.toggleFullscreen();
    }
  },
});


export default SlideGroup;
