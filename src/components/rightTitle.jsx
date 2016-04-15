import React from 'react';

import AppBar from 'material-ui/lib/app-bar';
import Colors from 'material-ui/lib/styles/colors';

import IconButton from 'material-ui/lib/icon-button';
import IconChevronRight from 'material-ui/lib/svg-icons/navigation/chevron-right';
import IconAdd from 'material-ui/lib/svg-icons/content/add';
import IconRemove from 'material-ui/lib/svg-icons/content/remove';

import lang from '../lang.js';

import Actions from '../actions/actions.js';
import Constants from '../constants/constants.js';

/****************
* RightTitle Component
****************/
const styles = {
  root: {
    height: Constants.APPBAR_HEIGHT,
    minHeight: Constants.APPBAR_HEIGHT,
    backgroundColor: Colors.blueGrey600,
  },
  btn: {
    width: 'inherit',
    height: 'inherit',
    padding: '0px',
    margin: '0px 3px'
  },
  titleStyle: {
    lineHeight: Constants.APPBAR_HEIGHT,
  },
};
const RightTitle = React.createClass({
  render() {
    return (
      <AppBar title = {lang.sidebar}
        style = {styles.root}
        titleStyle = {styles.titleStyle}
        iconElementLeft = {
          <IconButton tooltip = {lang.button.collapse} style = {styles.btn}
            onTouchTap = {this._handleToggleRight}>
            <IconChevronRight/>
          </IconButton>
        }
        iconElementRight = {
          <div>
            <IconButton tooltip = {lang.button.add} style = {styles.btn}
              onTouchTap = {this._handleAdd}>
              <IconAdd color={Colors.white}/>
            </IconButton>
            <IconButton tooltip = {lang.button.remove} style = {styles.btn}
              onTouchTap = {this._handleRemove}>
              <IconRemove color={Colors.white}/>
            </IconButton>
          </div>
        }
      />
    );
  },

  _handleAdd() {
    Actions.addSlide();
  },

  _handleRemove() {
    Actions.removeSlide();
  },

  _handleToggleRight() {
    Actions.toggleRight();
  },
});

export default RightTitle;
