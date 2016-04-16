import React from 'react';
import lang from '../lang.js';

import Colors from 'material-ui/lib/styles/colors';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';

//icon
import IconEditor from 'material-ui/lib/svg-icons/editor/mode-edit';
import IconActionAccount from 'material-ui/lib/svg-icons/action/account-circle';
import IconChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import IconFullscreen from 'material-ui/lib/svg-icons/navigation/fullscreen';
import IconNavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import IconActionHelp from 'material-ui/lib/svg-icons/action/help';

//router
import history from '../history';

// flux
import Actions from '../actions/actions';
import Constants from '../constants/constants';
import Store from '../stores/store';

//common
import EditableText from '../components/common/editableText';

const styles = {
  root: {
    zIndex: 500,
    height: Constants.APPBAR_HEIGHT,
    minHeight: '40px',
    paddingLeft: '0px',
    backgroundColor: Colors.blueGrey600,
  },
  titleStyle: {
    lineHeight: 'inherit',
    overflow: 'inherit',
  },
  btn: {
    width: 'inherit',
    height: 'inherit',
    padding: '0px',
    margin: '0px 3px'
  },
  avatar: {
    width: 'inherit',
    height: 'inherit',
    padding: '0px',
    margin: '0px 20px',
  },
  labelStyle: {
    fontSize: 'inherit',
    textTransform: 'inherit',
    padding: '0px 20px',
  },
  iconStyleRight: {
    marginRight: '0px',
  },
};

const MyAppBar = React.createClass({

  render() {
    var {title, children} = this.props;

    let titleElem = (
      <div>
        <RaisedButton label={lang.name} backgroundColor={Colors.redA100} labelColor={Colors.white}
        onTouchTap = {this._handleToggleLeft}
        labelStyle={styles.labelStyle}
        style={{
          height: '40px'
        }}/>

        <span className="title">
          <EditableText value={title} onStartEdit={this._handleStartEditTitle}
            onEndEdit={this._handleEndEditTitle}/>
        </span>

      </div>
    );

    // iconElementLeft = {<span/>} iconElementLeft如果不传，会使用默认的iconElementLeft，所以这里传<span/>
    return (
      <div>
        <AppBar
          title = {titleElem}
          iconElementLeft = {<span/>}
          iconStyleRight = {styles.iconStyleRight}
          iconElementRight = {null}
          style = {styles.root}
          titleStyle = {styles.titleStyle}
        >
        </AppBar>
        {children}
      </div>
    );
  },

  _changeMode() {
    Actions.changeMode(this.props.mode === Constants.MODE.MARKDOWN ? Constants.MODE.PRESENTATION : Constants.MODE.MARKDOWN);
  },

  _handleToggleLeft() {
    Actions.toggleLeft();
  },

  _handleToggleRight() {
    Actions.toggleRight();
  },

  _handleStartEditTitle() {
    this._lastMode = this.props.mode;
    Actions.changeMode(Constants.MODE.EDITING);
  },

  _handleEndEditTitle(title, oldTitle) {
    if(title !== oldTitle){
      Actions.titleChange(title);
    } else{
      Actions.changeMode(this._lastMode);
    }
  },
});

export default MyAppBar;
