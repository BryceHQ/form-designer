import React from 'react';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import IconButton from 'material-ui/lib/icon-button';

import IconAdd from 'material-ui/lib/svg-icons/content/add';
import IconRemove from 'material-ui/lib/svg-icons/content/remove';
import IconArrowDown from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-down';
import IconArrowUp from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-up';

const styles = {
  btn: {
    width: 'inherit',
    height: 'inherit',
    padding: '0px',
    margin: '0px 3px'
  },
};


const Title = React.createClass({
  propTypes: {
    // onClick: React.PropTypes.function.isRequired,
  },

  render(){
    var {text, addable, removable, style} = this.props;
    var buttons = [];
    var index = 0;

    buttons.push(
      <IconButton style = {styles.btn}
        key = {index++}
        onTouchTap = {this._handleToggleRight}>
        {this.props.collaped ? <IconArrowUp/> : <IconArrowDown/>}
      </IconButton>
    );
    if(addable){
      buttons.push(
        <IconButton style = {styles.btn}
          key = {index++}
          onTouchTap = {this._handleToggleRight}>
          <IconAdd/>
        </IconButton>
      );
    }

    if(removable){
      buttons.push(
        <IconButton style = {styles.btn}
          key = {index++}
          onTouchTap = {this._handleToggleRight}>
          <IconRemove/>
        </IconButton>
      );
    }

    return (
      <div style={style}>
        {buttons}
      </div>
    );
  },

  _handleAdd() {

  },

  _handleRemove() {

  }

});

export default Title;
