/*
* 提供数据绑定的辅助方法
*/

const DataBinding = {
  _compute(data) {
    var {dataInputs} = this.props;
    data = data || this.props.data;
    var hidden, value;
    if(data.hidden){
      try{
        var func = this._getFunction(dataInputs, data.hidden);
        hidden = func(this._toObject(dataInputs));
      } catch(e){
        console.error(`hidden expresssion error, please check data.hidden. ${e.message}`);
      }
    }

    if(data.expression){
      try{
        var func1 = this._getFunction(dataInputs, data.expression);
        value = func1(this._toObject(dataInputs));
      } catch(e){
        console.error(`expresssion error, please check data.expresssion. ${e.message}`);
      }
    } else if(data.value){
      var val = this._getValue(dataInputs, data.value);
      if(!_.isNil(val)){
        value = val;
      }
    }
    return {hidden, value};
  },

  _getValueForType(input, value) {
    switch(input.type){
      case 'bool':
        if(value === 'false') return false;
        return !!value;
      case 'int':
        value = value - 0;
        return isNaN(value) ? 0 : value;
      default:
        return value;
    }
  },

  _getValue(dataInputs, name) {
    var input = this._findDataInput(dataInputs, name);
    if(input){
      return input.value;
    }
  },

  _findDataInput(dataInputs, name) {
    var input;
    for(var i = 0,l = dataInputs.length; i < l; i++){
      input = dataInputs[i];
      if(!input || !input.name) continue;
      if(input.name === name){
        return input;
      }
    }
  },

  /*
  * 得到可以执行表达式的函数，带有dataInputs中的数据作为function内部的临时变量
  */
  _getFunction(dataInputs, expression){
    var arr = [];
    dataInputs.forEach(function(input){
      if(!input || !input.name) return;
      arr.push(`var ${input.name}=dataInputs.${input.name};`);
    });
    arr.push(`return ${expression};`);
    return new Function('dataInputs', arr.join(''));
  },

  _toObject(dataInputs){
    var obj = {};
    dataInputs.forEach(function(input){
      if(!input || !input.name) return;
      obj[input.name] = input.value;
    });
    return obj;
  },

};

export default DataBinding;
