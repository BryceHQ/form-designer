/*
* 表单显示模块 入口
*
*/

import React from 'react';
import _ from 'lodash';


import Store from '../stores/store';
import Actions from '../actions/actions';

import Constants from '../constants/constants';

import {parseForm} from '../parser.js';


const Display = React.createClass({
  getInitialState() {
    return Store.getData();
  },

  componentWillReceiveProps(nextProps) {

  },

  componentDidMount() {
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount() {
    Store.removeChangeListener(this._onChange);
  },

  render() {
    let {form, mode} = this.state;

    return (
      <div>
        {parseForm(form, form.attributes.dataInputs)}
      </div>
    );
  },

  _onChange() {
    this.setState(Store.getData());
  },
});

export default Display;
