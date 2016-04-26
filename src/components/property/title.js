import React from 'react';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';

import IconAdd from 'material-ui/lib/svg-icons/content/add';
import IconRemove from 'material-ui/lib/svg-icons/content/remove';
import IconArrowDown from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-down';
import IconArrowUp from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-up';

const styles = {
  btn: {
    width: 18,
    height: 18,
    padding: '0px',
    margin: '0px 3px',
    verticalAlign: 'middle',
  },
  label: {
    // width: '20px',
    height: '20px',
    lineHeight: '20px',
    padding: '0 5px',
    textTransform: null,
    minWidth: 50,
  },
  labelStyle: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  svg: {
    width: 18,
    height: 18,
    margin: '0',
    verticalAlign: 'middle',
  },
};


const Title = React.createClass({
  propTypes: {
    // onClick: React.PropTypes.function.isRequired,
  },

  render(){
    var {text, addable, collaped, removable, style} = this.props;
    var buttons = [];
    var index = 0;
    if(typeof removable === 'undefined' || removable === null){
      removable = addable;
    }

    buttons.push(
      <FlatButton
        label={text}
        labelPosition="before"
        key={index++}
        style={styles.label}
        labelStyle={styles.labelStyle}
        iconStyle={styles.svg}
        onTouchTap={this._handleTouchTap}
        >
        {this.props.collaped ? <IconArrowUp color={Colors.grey500} style={styles.svg}/> : <IconArrowDown color={Colors.grey500} style={styles.svg}/>}
      </FlatButton>
    );
    if(!collaped){
      if(addable){
        buttons.push(
          <IconButton style={styles.btn} iconStyle={styles.svg}
            key={index++}
            onTouchTap={this._handleAdd}>
            <IconAdd color={Colors.grey500}/>
          </IconButton>
        );
      }

      if(removable){
        buttons.push(
          <IconButton style={styles.btn} iconStyle={styles.svg}
            key={index++}
            onTouchTap={this._handleRemove}>
            <IconRemove color={Colors.grey500} />
          </IconButton>
        );
      }
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

  },

  _handleTouchTap(event){
    if(this.props.onTouchTap){
      this.props.onTouchTap(event);
    }
  },

});

export default Title;
