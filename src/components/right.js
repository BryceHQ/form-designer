import React from 'react';
import lang from '../lang.js';

import LeftNav from 'material-ui/lib/left-nav';

import RightTitle from './rightTitle';
import CollapsableField from './property/collapsableField';

import theme from '../theme';
let {spacing} = theme;

import Actions from '../actions/actions';

const styles = {
  root: {
    // top: spacing.appbarHeight,
    zIndex: 1000,
    overflow: 'hidden',
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
        style = {styles.root}
        width = {spacing.rightWidth + 100}
        open = {open}
        openRight = {true}
        onRequestChange = {open => Actions.toggleRight(open.open)}
      >
        <RightTitle></RightTitle>
        <CollapsableField data={rightData}></CollapsableField>
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
