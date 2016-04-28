/*
* 工具箱
*/
import React from 'react';

import Drag from './draggable/drag';
import Alert from './common/alert';

import {options} from './form';

import {spacing} from '../theme';


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
        <Drag mode={mode} isCloneTarget={true} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [options.labeledInput]
        }}>
          <Alert type="info">input</Alert>
        </Drag>
        <Drag mode={mode} isCloneTarget={true} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [options.labeledRadio]
        }}>
          <Alert type="error">radio</Alert>
        </Drag>
        <Drag mode={mode} isCloneTarget={true} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [options.labeledCheckbox]
        }}>
          <Alert type="error">checkbox</Alert>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [options.labeledCombobox]
        }}>
          <Alert type="error">combobox</Alert>
        </Drag>
      </div>
    );
  },
});

export default Kit;
