/*
* 属性页
*
*/
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Colors from 'material-ui/lib/styles/colors';

import IconButton from 'material-ui/lib/icon-button';
import IconChevronRight from 'material-ui/lib/svg-icons/navigation/chevron-right';

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
// import Tab from './tab';

import CollapsableField from './collapsableField';

import Actions from '../../actions/actions.js';

import lang from '../../lang.js';
import {spacing} from '../../theme';

const styles = {
  tab: {
    height: spacing.appbarHeight,
    textTransform: null,
  },
  inkBarStyle: {
    backgroundColor: Colors.redA100,
  },
  tabItemContainerStyle: {
    backgroundColor: Colors.blueGrey600,
  },
  collapseBtn: {
    position: 'absolute',
    top: 0,
    right: spacing.rightWidth + 100 - 40,
    zIndex: '1000',
    height: 40,
    width: 40,
    padding: '5px',
  },
};


const Property = React.createClass({
  propTypes: {
    // onClick: React.PropTypes.function.isRequired,
  },
  getInitialState() {
    return {
      value: 0,
    };
  },

  render() {
    var {open, data, className, formatter} = this.props;
    var {value} = this.state;
    var componentClass = classnames('Tab', className);

    var tabs = [];
    if(data && data.length > 0){
      if(value >= data.length){
        value = 0;
      }

      data.forEach(function(tab, index){
        tabs.push(
          <Tab label = {tab.name} key = {index} style={styles.tab} value={index}
          >
            <CollapsableField data = {tab.data} formatter = {formatter}/>
          </Tab>
        );
      });
    }
    let collapseBtn;
    if(open){
      collapseBtn = (
        <IconButton tooltip = {lang.button.collapse} style={styles.collapseBtn}
          onTouchTap = {() => Actions.toggleRight()}>
          <IconChevronRight color="white"/>
        </IconButton>
      );
    }
    return (
      <div>
        <Tabs className={componentClass} value={value}
          inkBarStyle={styles.inkBarStyle} tabItemContainerStyle={styles.tabItemContainerStyle}
          onChange={this._handleTabChange}
        >
          {tabs}
        </Tabs>
        {collapseBtn}
      </div>
    );
  },

  _handleTabChange(value) {
    // tabs onChange 会注册到div上，比如，我在tab内的一个input中输入内容，会触发这个onChange事件 material ui的bug
    if(typeof value === 'number'){
      this.setState({value});
    }
  },
});

export default Property;
