/*
* default config
*/
import _ from 'lodash';

var _config = {
  editors : {
    type: {
      type: 'combobox',
      options: [{
        text: '字符串', value: 'string'
      }, {
        text:'数值', value: 'int'
      }, {
        text: '布尔值', value: 'bool',
      }, {
        text: '日期', value: 'datetime',
      }]
    },
  },
};

var configManager = {
  get(path) {
    if(path){
      return _.get(_config, path);
    }
    return _config;
  },

  set(config) {
    _config = config;
  },
};

export default configManager;
