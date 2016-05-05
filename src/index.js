import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/app';

import Store from './stores/store';

require("../less/index.less");

//Needed for onTouchTap
//Can go away when react 1.0 release?? it's not right. I have react 1.14, but I couldn't use tap without it.
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// var data = {"name":"Form","attributes":{"title":"请假","dataInputs":[],"_options":{"dataInputs":{"defaultChild":{"name":"","type":"","defaultValue":""},"childName":"input"}}},"children":[{"name":"Row","children":[{"name":"Col","attributes":{"basis":"20%","key":"b40jrplrku80","uniqueKey":"b40jrplrku80"},"children":[{"name":"LabeledInput","attributes":{"name":"","label":"名称","placeholder":"请输入...","required":false,"requiredMessage":"该项为必填项","rule":"","invalidMessage":"请输入有效值","vertical":false,"multiline":false,"style":{},"_options":{"required":{"editor":{"type":"checkbox"}},"vertical":{"editor":{"type":"checkbox"}},"multiline":{"editor":{"type":"checkbox"}},"rule":{"editor":{"type":"combobox","options":[{"text":"请选择","value":""},{"text":"数字和字母","value":"ASCII"}]}},"requiredMessage":{"hidden":{"targetName":"required","targetValues":true}},"style":{"keyEditable":true,"defaultChild":{"":""}}},"key":"b40jrplrhigo","uniqueKey":"b40jrplrhigo"}}]}],"attributes":{"key":"b40jrplrlq80","uniqueKey":"b40jrplrlq80"}}]};
// Store.setForm(data);

ReactDOM.render(<App />, document.getElementById('root'));

export default Store;
