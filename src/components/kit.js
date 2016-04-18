/*
* 工具箱
*/
import React from 'react';

import Drag from './draggable/drag';
import Alert from './common/alert';


import theme from '../theme';
let {spacing} = theme;


const styles = {
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: spacing.rightWidth,
    zIndex: 10,
  }
};

const Kit = React.createClass({

  render() {
    var {mode} = this.props;
    return (
      <div style={styles.root}>
        <Drag mode={mode} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [{
            name: 'LabeledInput',
            attributes: {
              label: '名称',
              vertical: true,
              style: {
                color: 'red',
              },
            }
          }]
        }}>
          <Alert type="info">input</Alert>
        </Drag>
        <Drag mode={mode} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [{
            name: 'LabeledInput',
            attributes: {
              label: '名称'
            }
          }]
        }}>
          <Alert type="error">input</Alert>
        </Drag>
        <Drag mode={mode} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [{
            name: 'LabeledInput',
            attributes: {
              label: '名称',
              multiline: true,
            }
          }]
        }}>
          <Alert type="error">textarea</Alert>
        </Drag>
      </div>
    );
  },
});

export default Kit;
