import React from 'react';
import _ from 'lodash';

import Actions from '../actions/actions';

import Constants from '../constants/constants';

import Store from '../stores/store';

import Right from './right';
import Center from './center';
import Kit from './kit';

import {Mode} from '../constants/constants';

import {spacing} from '../theme';

const Main = React.createClass({
  render() {
    let {mode, data, style, property, selectKey} = this.props;

    return (
      <div className="main">
        <Center data={data} mode={mode}></Center>
        <Kit mode={mode}></Kit>
        <Right open={mode.equalTo(Mode.PROPERTY)} data={property}></Right>
      </div>
    );
  },
});


export default Main;
