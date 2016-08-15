/*
* 表单显示模块 入口
* 显示模块需要兼容ie8。不使用Flux，material ui
*/
import React from 'react';

import Store from './store';

import parser from './parser.js';


const App = React.createClass({
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
    let {form} = this.state;

    return (
      <div>
        {form ? parser(form, Store.getDataInputs(), this._emitChange) : null}
      </div>
    );
  },

  _emitChange() {
    Store.emitChange();
  },

  _onChange() {
    this.setState(Store.getData());
  },
});

export default App;
