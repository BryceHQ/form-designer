import React from 'react';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import DropDownArrow from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';

import DragButton from './draggable/btn';

import Actions from '../actions/actions';

import lang from '../lang';

import {spacing} from '../theme';

const styles = {
  root: {
    backgroundColor: null,
    height: `${spacing.toolbarHeight}px`,
    borderBottom: '1px solid rgb(232,232,232)'
  },
  dropDown: {
    height: `${spacing.toolbarHeight}px`,
  },
};

const SimpleToolbar = React.createClass({
  propTypes: {
    transition: React.PropTypes.string,
  },

  render() {
    let {children, transition, duang} = this.props;
    return (
      <Toolbar style={styles.root}>
        <ToolbarGroup firstChild={true} float="left">
          <DragButton/>
        </ToolbarGroup>
      </Toolbar>
    );
  },
});

export default SimpleToolbar;
