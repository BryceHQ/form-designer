import React from 'react';

import Drag from './draggable/Drag';
import Alert from './common/alert';

const styles = {
  root: {
    width: '200px',
  }
};

const Left = React.createClass({

  render() {
    return (
      <div style={styles.root}>
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

export default Left;
