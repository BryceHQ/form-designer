import React from 'react';
import lang from '../lang.js';

import LeftNav from 'material-ui/lib/left-nav';
import Avatar from 'material-ui/lib/avatar';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

import Actions from '../actions/actions.js';

import MenuStore from '../stores/menuStore.js';

import Menu from './menu/menu.jsx';

const styles = {
  avatarContainer: {
    padding: '10px 0px 10px 20px',
    textAlign: 'center',
  },
  avatar: {borderRadius: '0'},
  root: {overflow: 'hidden'},
};

const Left = React.createClass({
  getDefaultProps() {
    return {open: false};
  },

  render() {
    let {open, menu, user} = this.props;

    return (
      <LeftNav
        style = {styles.root}
        width = {500}
        open = {open}
        docked = {false}
        openRight = {false}
        onRequestChange = {open => Actions.toggleLeft(open.open)}
      >
        <div style={styles.avatarContainer}
        >
          <Avatar src={user.icon} style={styles.avatar}/>
        </div>
        <Divider/>

        <Menu {...menu}/>
      </LeftNav>
    );
  },

});

export default Left;
