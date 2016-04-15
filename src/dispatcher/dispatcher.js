import {Dispatcher} from 'flux';

//如果有任务正在派发，则直接忽略当前任务
class SimpleIgnoreDispatcher extends Dispatcher{
  dispatch(data) {
    if(!this._isDispatching){
      super.dispatch(data);
    }
  }
}

let dispatcher = new SimpleIgnoreDispatcher();

export default dispatcher;
