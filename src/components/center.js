import React from 'react';
import lang from '../lang.js';
import parser from '../parser.js';

import Actions from '../actions/actions';

import Drop from './draggable/drop';

const Center = React.createClass({
  render() {
    let {data, mode, style} = this.props;
    return (
      <Drop className="center" target={data} style={style}>
        {parser(data)}
      </Drop>
    );
  },

});

export default Center;
