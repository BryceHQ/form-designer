import React from 'react';

import Toolbar from './toolbar';
import Left from './left';

const Main = React.createClass({

  render() {
    return (
      <div className = "container">
        <Toolbar/>
        <Left/>
      </div>
    );
  },
});

export default Main;
