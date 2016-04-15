import React from 'react';
import lang from '../lang.js';

import Actions from '../actions/actions.js';

import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';

import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';
import IconActionAccount from 'material-ui/lib/svg-icons/action/account-circle';

/*
* 带缺省头像和菜单的Avatar
*/
const DefaultAvatar = React.createClass({
  getDefaultProps() {
    return {
    };
  },

  render() {
    let {src, tooltip, style, onTouchTap} = this.props;

    if(!src){
      return (
        <IconButton tooltip = {tooltip} style={style}
          onTouchTap = {onTouchTap}>
          <IconActionAccount color={Colors.white} />
        </IconButton>
      );
    }

    return (
      <IconMenu onItemTouchTap = {this._handleItemTouchTap}
        iconButtonElement={
          <IconButton style={style} tooltip = {tooltip}>
            <Avatar style={{borderRadius: null}} size={25} src={src} />
          </IconButton>
        }
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
      >
        <MenuItem primaryText={lang.button.personCenter} key="person"/>
        <MenuItem primaryText={lang.button.logout} key="logout"/>
      </IconMenu>
    );
  },

  _handleItemTouchTap(e, menuItem) {
    switch (menuItem.key) {
      case 'person':
        if(this.props.onTouchTap){
          this.props.onTouchTap();
        }
        break;
      case 'logout':
        Actions.logout();
        break;
      default:
        break;
    }
  },

});

export default DefaultAvatar;
