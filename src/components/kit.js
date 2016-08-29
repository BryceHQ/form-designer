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

import options from './form/options';

import {spacing} from '../theme';

import {Mode} from '../constants/constants';

import langSupport from './mixins/langSupport';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: spacing.rightWidth,
    zIndex: 10,
    overflowY: 'auto',
    borderWidth: '0 0 0 1px',
    borderStyle: 'solid',
    borderColor: Colors.grey300,
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
    boxShadow: null,
    borderWidth: '0 0 1px 0',
    borderStyle: 'solid',
    borderColor: Colors.grey300,
  },
};

const Kit = React.createClass({
  mixins: [langSupport],

  renderDustbin(){
    if(this.props.mode.equalTo(Mode.DRAG, true)){
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
        <Drag mode={mode} source="kit" target={options.labeledTextbox}
          title={this._getText('kit.textbox')} style={styles.drag}>
          <Textbox disabled={true} placeholder=""/>
        </Drag>

        <Drag mode={mode} source="kit" target={options.labeledRadio}
          title={this._getText('kit.radio')} style={styles.drag}>
          <Radio disabled={true}/>
        </Drag>

        <Drag mode={mode} source="kit" target={options.labeledCheckbox}
          title={this._getText('kit.checkbox')} style={styles.drag}>
          <Checkbox disabled={true}/>
        </Drag>

        <Drag mode={mode} source="kit" target={options.labeledCombobox}
          title={this._getText('kit.combobox')} style={styles.drag}>
          <Combobox disabled={true}/>
        </Drag>

        <Drag mode={mode} source="kit" target={options.labeledDatebox}
          title={this._getText('kit.datebox')} style={styles.drag}>
          <Textbox disabled={true} placeholder="日期控件"/>
        </Drag>

        <Drag mode={mode} source="kit" target={options.labeledDateboxRange}
          title={this._getText('kit.dateRange')} style={styles.drag}>
          <Textbox disabled={true} placeholder="日期范围"/>
        </Drag>


        {this.renderDustbin()}
      </div>
    );
  },
});

export default Kit;
/*<Drag mode={mode} isCloneTarget={true} target={options.datagrid}
  title="datagrid" style={styles.drag}>
  <Datagrid title="表格" pagination={false} fit={false} toolbar={false}></Datagrid>
</Drag>*/
