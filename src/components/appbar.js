import React from 'react';
import lang from '../lang.js';

import Colors from 'material-ui/lib/styles/colors';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';

//icon
import IconEditor from 'material-ui/lib/svg-icons/editor/mode-edit';
import IconActionAccount from 'material-ui/lib/svg-icons/action/account-circle';
import IconChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left';
import IconFullscreen from 'material-ui/lib/svg-icons/navigation/fullscreen';
import IconNavigationMenu from 'material-ui/lib/svg-icons/navigation/menu';
import IconActionHelp from 'material-ui/lib/svg-icons/action/help';
import IconActionCheck from 'material-ui/lib/svg-icons/action/check-circle';
import IconActionDone from 'material-ui/lib/svg-icons/action/done';
import IconActionDoneAll from 'material-ui/lib/svg-icons/action/done-all';
import IconActionVisibility from 'material-ui/lib/svg-icons/action/visibility';


//router
import history from '../history';

// flux
import Actions from '../actions/actions';
import Constants from '../constants/constants';
import Store from '../stores/store';

//common
import EditableText from '../components/common/editableText';

import {spacing} from '../theme';

const styles = {
  root: {
    zIndex: 500,
    height: spacing.appbarHeight,
    lineHeight: spacing.appbarHeight + 'px',
    minHeight: '40px',
    paddingLeft: '0px',
    backgroundColor: Colors.blueGrey600,
    verticalAlign: 'middle',
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
  iconBtn: {
    width: spacing.appbarHeight,
    height: spacing.appbarHeight,
    // margin: '0 14px',
    padding: '5px',
  },
  titleBtn: {
    height: spacing.appbarHeight+'px',
    verticalAlign: 'top',
    textTransform: 'none',
  },
  labelStyle: {
    fontSize: 'inherit',
    textTransform: 'inherit',
    padding: '0px 20px',
    color: 'white',
  },
  titleLabel: {
    fontSize: 20,
    padding: '0px 20px',
    color: 'white',
  },
  iconStyleRight: {
    marginRight: '0px',
  },
};

const MyAppBar = React.createClass({
  getText(key){
    return lang.button[key] || key;
  },

  render() {
    var {title, children} = this.props;

    let titleElem = (
      <div>
        <RaisedButton label={lang.name} backgroundColor={Colors.redA100} labelColor={Colors.white}
          onTouchTap = {this._handleToggleLeft}
          labelStyle={styles.labelStyle}
          style={styles.titleBtn}/>

        <IconButton style={styles.iconBtn} tooltip={this.getText('save')} iconStyle={styles.svg}
          onTouchTap = {this._handleSave}
        >
          <IconActionCheck color="white"/>
        </IconButton>
        <IconButton style={styles.iconBtn} tooltip={this.getText('release')} iconStyle={styles.svg}
          onTouchTap = {this._handleRelease}
        >
          <IconActionDone color="white"/>
        </IconButton>
        <IconButton style={styles.iconBtn} tooltip={this.getText('releaseNew')} iconStyle={styles.svg}
          onTouchTap = {this._handleReleaseNew}
        >
          <IconActionDoneAll color="white"/>
        </IconButton>
        <IconButton style={styles.iconBtn} tooltip={this.getText('preview')} iconStyle={styles.svg}
          onTouchTap = {this._handlePreview}
        >
          <IconActionVisibility color="white"/>
        </IconButton>

        <FlatButton  label={title} backgroundColor={Colors.blueGrey600} labelColor={Colors.white}
          onTouchTap = {this._handleToggleRight}
          labelStyle={styles.titleLabel}
          style={styles.titleBtn}/>

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

    Actions.toggleRight(true, [{
        name: 'basic',
        data: this.props.form.attributes,
      }
    ]);
  },

  _handlePreview() {
    Actions.preview();
  },

  _handleSave() {
    Actions.save();
  },

  _handleRelease() {
    Actions.save(true);
  },

  _handleReleaseNew() {
    Actions.save(true, true);
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
