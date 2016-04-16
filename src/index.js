import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

import injectTapEventPlugin from 'react-tap-event-plugin';

require("../less/index.less");


//Needed for onTouchTap
//Can go away when react 1.0 release?? it's not right. I have react 1.14, but I couldn't use tap without it.
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
