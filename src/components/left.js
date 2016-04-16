import React from 'react';

import Drag from './draggable/Drag';
import Alert from './common/alert';

const styles = {

};

const Center = React.createClass({

  render() {
    return (
      <div className="left" >
        <Drag uniqueKey="a">
          <input/>
        </Drag>
        <Drag uniqueKey="b">
          <Alert type="error">test</Alert>
        </Drag>
      </div>
    );
  },
});

export default Center;
