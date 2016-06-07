/*
* 工具箱，自带删除面板。
*/
import React from 'react';

import Colors from 'material-ui/lib/styles/colors';
import Popover from 'material-ui/lib/popover/popover';

import IconDelete from 'material-ui/lib/svg-icons/action/delete';

import Datagrid from 'datagrid';

import Drag from './draggable/drag';
import Drop from './draggable/drop';

import Alert from './common/alert';
import Textbox from './common/editor/textbox';
import Checkbox from './common/editor/checkbox';
import Combobox from './common/editor/combobox';
import Radio from './common/editor/radio';

import {options} from './form';

import {spacing} from '../theme';

import {Mode} from '../constants/constants';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: spacing.rightWidth,
    zIndex: 10,
    overflowY: 'auto',
  },
  popover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: spacing.rightWidth,
    zIndex: 15,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  svg: {
    height: 80,
    width: 80,
  },
  drag: {
    padding: '5px 20px',
    textAlign: 'center',
  },
};

const Kit = React.createClass({

  renderDustbin(){
    if(this.props.mode === Mode.DRAG){
      return (
        <Drop style={styles.popover}>
          <IconDelete color={Colors.grey200} style={styles.svg}/>
        </Drop>
      );
    }
  },

  render() {
    var {mode} = this.props;
    return (
      <div ref='container' style={styles.root}>
        <Drag mode={mode} isCloneTarget={true} target={options.labeledTextbox}
          title="textbox" style={styles.drag}>
          <Textbox disabled={true} placeholder=""/>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={options.labeledRadio}
          title="radio" style={styles.drag}>
          <Radio disabled={true}/>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={options.labeledCheckbox}
          title="checkbox" style={styles.drag}>
          <Checkbox disabled={true}/>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={options.labeledCombobox}
          title="combobox" style={styles.drag}>
          <Combobox disabled={true}/>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={options.labeledDatebox}
          title="datebox" style={styles.drag}>
          <Textbox disabled={true} placeholder="日期控件"/>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={options.labeledDateboxRange}
          title="datebox" style={styles.drag}>
          <Textbox disabled={true} placeholder="日期范围"/>
        </Drag>

        <Drag mode={mode} isCloneTarget={true} target={options.datagrid}
          title="datagrid" style={styles.drag}>
          <Datagrid title="表格" pagination={false} fit={false} ></Datagrid>
        </Drag>

        {this.renderDustbin()}
      </div>
    );
  },
});

export default Kit;
