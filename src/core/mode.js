/*
 * Mode 实现一种层级形式的mode。形如： mode.submode.subSubmode
 */
class Mode {
  constructor(value) {
    this.value = value;
  }

  /*
  * 实现比较功能
  * @param mode {Mode|string}
  * @param strict {bool}
  */
  equalTo(mode, strict) {
    if(typeof mode !== 'string'){
      mode = mode.value;
    }
    if(strict === true){
      return this.value === mode;
    }
    return this.value.indexOf(mode) === 0;
  }

}

export default Mode;
