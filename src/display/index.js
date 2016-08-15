/*
* 表单显示
*
*/
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Display from './app';

import Store from './store';

import Profile from '../profile';

require("../../less/display.less");


//Needed for onTouchTap
//Can go away when react 1.0 release?? it's not right. I have react 1.14, but I couldn't use tap without it.
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(<Display />, document.getElementById('root'));


export default Store;
