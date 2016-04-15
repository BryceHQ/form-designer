import React from 'react';
import lang from '../lang.js';

import LeftNav from 'material-ui/lib/left-nav';

import Actions from '../actions/actions.js';

import RightTitle from './rightTitle.jsx';
import DraggableList from './draggableList.jsx';

const Right = React.createClass({
  getDefaultProps() {
    return {open: false};
  },

  render() {
    let {open, data, current} = this.props;
    return (
      <LeftNav
        style = {{overflow: 'hidden', zIndex: '1000'}}
        width = {350}
        open = {open}
        openRight = {true}
        onRequestChange = {open => Actions.toggleRight(open.open)}
      >
        <RightTitle />
        <DraggableList data = {data} current = {current}/>
      </LeftNav>
    );
  },
});

export default Right;
