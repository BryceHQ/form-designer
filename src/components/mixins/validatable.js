/*
* validate rule
*/
// do the right thing

const rules = {
  //仅数字和字母
  ASCII(value) {
    var flag = !/[^a-zA-Z0-9]/.test(value);
    if(flag){
      //以数字开头
      return !/^[0-9]/.test(value);
    }
    return flag;
  },
};

const Validatable = {
  validate(rule, value) {
    if(rules[rule]){
      return rules[rule](value);
    }
    return true;
  }
};

export default Validatable;
