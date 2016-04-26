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
              name: '',
              label: '名称',
              placeholder: '请输入...',
              required: false,
              requiredMessage: '该项为必填项',
              rule: '',
              invalidMessage: '请输入有效值',
              vertical: true,
              style: {
                color: 'red',
              },
              //内置属性，用来设置属性的特殊属性 editor, hidden
              _options: {
                required: {
                  editor: {type: 'checkbox'},
                },
                vertical: {
                  editor: {type: 'checkbox'},
                },
                rule: {
                  editor: {
                    type: 'combobox',
                    options: [{text: '请选择', value: ''},{text:'数字和字母', value:'ASCII'}]
                  }
                },
                requiredMessage: {
                  hidden: {
                    targetName: 'required',
                    targetValues: true,
                  }
                }
              },
            },
          }]
        }}>
          <Alert type="info">input</Alert>
        </Drag>
        <Drag mode={mode} target={{
          name: 'Col',
          attributes: {basis: '20%'},
          children: [{
            name: 'LabeledRadio',
            attributes: {
              name: '',
              label: '名称',
              vertical: true,
              options: [{text: 'click me', value: 'me'}, {text: 'click she', value: 'she'}],
              optionsVertical: true,
              style: {
                color: 'red',
              },
              //内置属性，用来设置属性的特殊属性 editor, hidden
              _options: {
                vertical: {
                  editor: {type: 'checkbox'},
                },
                optionsVertical: {
                  editor: {type: 'checkbox'},
                },
                style: {
                  keyEditable: true,
                }
              },
            },
          }]
        }}>
          <Alert type="error">radio</Alert>
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
