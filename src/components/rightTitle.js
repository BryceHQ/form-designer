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

import {spacing} from '../theme';


/****************
* RightTitle Component
****************/

const styles = {
  root: {
    height: spacing.appbarHeight,
    minHeight: spacing.appbarHeight,
    backgroundColor: Colors.blueGrey600,
  },
  btn: {
    width: 'inherit',
    height: 'inherit',
    padding: '0px',
    margin: '0px 3px'
  },
  titleStyle: {
    lineHeight: spacing.appbarHeight,
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
