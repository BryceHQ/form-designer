import React from 'react';
import lang from '../lang.js';
import parser from '../parser.js';

import LeftNav from 'material-ui/lib/left-nav';

import Drop from './draggable/drop';
import Alert from './common/alert';

import Col from './form/col';
import Row from './form/row';

import Actions from '../actions/actions';

const styles = {

};

const Center = React.createClass({
  getDefaultProps() {
    return {};
  },

  render() {
    let {rightOpen, data, mode, style} = this.props;
    return (
      <Drop className="form-container" target={data} style={style}>
        {parser(null, data, true, true)}
      </Drop>
    );
  },

  _handleClick(event){
    if(this.props.rightOpen){
      Actions.toggleRight(false);
    }
  },
});

export default Center;
