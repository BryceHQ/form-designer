import React from 'react';
import lang from '../lang.js';

import LeftNav from 'material-ui/lib/left-nav';

import RightTitle from './rightTitle';
import Property from './property';

import {spacing} from '../theme';

import Actions from '../actions/actions';

const styles = {
  root: {
    // top: spacing.appbarHeight,
    zIndex: 1000,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  overlay: {
    backgroundColor: 'white',
    opacity: 0,
  }
};

const Right = React.createClass({
  getDefaultProps() {
    return {};
  },

  render() {
    let {open, options, mode, rightData} = this.props;
    return (
      <LeftNav
        className="right"
        style = {styles.root}
        width = {spacing.rightWidth + 100}
        open = {open}
        openRight = {true}
        onRequestChange = {open => Actions.toggleRight(open.open)}
      >
        <Property data={rightData} open={open}></Property>
      </LeftNav>
    );
  },

});
// open: false,
// formatter: formatter,
// onBeforeChange: handleBeforeChange, //return false 该更改会被拒绝。需要返回值，无法debounce
// onChange: jsonEditor.Utils.debounce(handleChange, 1000), //稀释
// onRemoveChild: beforeRemove,
// onAddChild: beforeAdd,

export default Right;
