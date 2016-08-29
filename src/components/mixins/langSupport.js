/*
* lang support
*/
import lang from '../../lang';

const langSupport = {
  _getText(key) {
    var arr = key.split('.');
    var target = lang;
    while(arr.length > 0){
      key = arr.shift();
      target = target[key];
      if(!target){
        return arr[arr.length - 1];
      }
    }
    return target;
  }
};

export default langSupport;
