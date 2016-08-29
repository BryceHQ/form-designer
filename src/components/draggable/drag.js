import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';
import Store from '../../stores/store';
import {Mode} from '../../constants/constants';


const Drag = React.createClass({
  propTypes: {
    isCloneTarget: React.PropTypes.bool,
    target: React.PropTypes.object,
    index: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
    };
  },

  getInitialState() {
    return {
      opacity: 1,
    };
  },



  render() {
    const {className, style, target, source, ...props} = this.props;
    const {opacity} = this.state;
    var componentClass = classnames('drag', className);

    var dragStyle = {
      boxShadow: `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px`,
      opacity: opacity,
    };
    return(
      <div ref="target"
        {...props}
        className={componentClass}
        draggable={true}
        onDragStart={this._handleDragStart}
        onDragEnd={this._handleDragEnd}
        style={_.assign(dragStyle, style)}>
      </div>
    );
  },

  _handleDragStart(event) {
    this.setState({opacity: 0.3});
    var {target, source} = this.props;
    Actions.startDrag(target, source);
    event.stopPropagation();
  },

  _handleDragEnd(event) {
    if(Store.getData().mode.equalTo(Mode.DRAG)){
      Actions.endDrag(false);
    }
    if(this.state.opacity !== 1){
      this.setState({opacity: 1});
    }
    event.stopPropagation();
  },
});

export default Drag;
