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
        hidden = func(dataInputs);
      } catch(e){
        console.error(`hidden expresssion error, please check data.hidden. ${e.message}`);
      }
    }

    if(data.computed){
      if(data.expression){
        try{
          var func1 = this._getFunction(dataInputs, data.expression);
          value = func1(dataInputs);
        } catch(e){
          console.error(`expresssion error, please check data.expresssion. ${e.message}`);
        }
      }
    } else if(data.name){
      var val = dataInputs[data.name];
      if(!_.isNil(val)){
        value = val;
      }
    }
    return {hidden, value};
  },

  _getValueForType(type, value) {
    switch(type){
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

  /*
  * 得到可以执行表达式的函数，带有dataInputs中的数据作为function内部的临时变量
  */
  _getFunction(dataInputs, expression){
    var arr = [];
    for(var key in dataInputs){
      if(!dataInputs.hasOwnProperty(key)) continue;
      arr.push(`var ${key} = dataInputs.${key};`);
    }
    arr.push(`return ${expression};`);
    return new Function('dataInputs', arr.join(''));
  },

};

export default DataBinding;
