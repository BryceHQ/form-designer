import React from 'react';
import lang from '../../lang.js';

import ListItem from 'material-ui/lib/lists/list-item';


import Actions from '../../actions/actions.js';

import SimpleList from '../common/list.jsx';


const History = React.createClass({

  render() {

    return (
      <div>
        <SimpleList {...this.props} onTouchTap={this._handleTouchTab}/>
      </div>
    );
  },

  _handleTouchTab(data, index){

  },

});

export default History;
