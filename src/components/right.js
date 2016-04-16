import React from 'react';
import lang from '../lang.js';

import LeftNav from 'material-ui/lib/left-nav';
import Drag from './draggable/Drag';
import Alert from './common/alert';

import Actions from '../actions/actions';

const styles = {

};

const Right = React.createClass({
  getDefaultProps() {
    return {open: false};
  },

  render() {
    let {open} = this.props;
    return (
      <div className="right" style={styles.root}>

      </div>
    );
  },
});

//
// <LeftNav
//   style = {{overflow: 'hidden', zIndex: '1000'}}
//   width = {350}
//   open = {open}
//   openRight = {true}
//   onRequestChange = {open => Actions.toggleRight(open.open)}
// >
// </LeftNav>

export default Right;
