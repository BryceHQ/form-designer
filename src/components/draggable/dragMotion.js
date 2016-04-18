import React from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import $ from 'jquery';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';


function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 120, damping: 20};

const Drag = React.createClass({
  propTypes: {
    uniqueKey: React.PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
    };
  },

  getInitialState() {
    return {
      x: 0,
      y: 0,
      isPressed: false,
      width: 'auto',
    };
  },

  componentDidMount() {
    window.addEventListener('touchmove', this._handleTouchMove);
    window.addEventListener("touchend", this._handleMouseUp);
    window.addEventListener('mousemove', this._handleMouseMove);
    window.addEventListener("mouseup", this._handleMouseUp);
  },

  componentWillUnmount() {
    window.removeEventListener('touchmove', this._handleTouchMove);
    window.removeEventListener("touchend", this._handleMouseUp);
    window.removeEventListener('mousemove', this._handleMouseMove);
    window.removeEventListener("mouseup", this._handleMouseUp);
  },

  render() {
    const {children, uniqueKey, classNane} = this.props;
    const {x, y, isPressed, width} = this.state;
    var props = _.omit(this.props, ['children', 'uniqueKey', 'className', 'target']);
    if(!isPressed){
      return(
        <div ref="target"
          {...props}
          onMouseDown={this._handleMouseDown}
          onTouchStart={this._handleTouchStart}
          style={{
            boxShadow: `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px`,
            padding: '5px 10px',
          }}>
          {children}
        </div>
      );
    }
    const style = (isPressed) ?
      {
        scale: spring(1.05, springConfig),
        shadow: spring(16, springConfig),
        y: y,
        x: x,
      } : {
        scale: spring(1, springConfig),
        shadow: spring(1, springConfig),
        y: spring( 0, springConfig),
        x: spring( 0, springConfig),
      };

    return (
      <div {...props}>
        <div ref="target"
          style={{
            boxShadow: `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px`,
            padding: '5px 10px',
          }}>
          {children}
        </div>

        <Motion style={style} key={uniqueKey}>
          {({scale, shadow, x, y}) =>
            <div
              onMouseDown={this._handleMouseDown}
              onTouchStart={this._handleTouchStart}
              style={{
                boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                // zIndex: isPressed ? 99 : null,
                padding: '5px 10px',
                position: 'absolute',
                width: width,
              }}>
              {children}
            </div>
          }
        </Motion>
      </div>
    );
  },

  _handleTouchStart(e) {
    this._handleMouseDown(e.touches[0]);
  },

  _handleTouchMove(e) {
    if(!this.state.isPressed) return;
    e.preventDefault();
    this._handleMove(e.touches[0]);
  },

  _handleMouseDown({pageX, pageY}) {
    var target = $(this.refs.target);
    var height = target.outerHeight();
    this._startX = pageX;
    this._startY = pageY + height;
    this.setState({
      x: 0,
      y: -height,
      isPressed: true,
      width: target.outerWidth()
    });

    Actions.startDrag(this.props.target);
  },

  _handleMouseMove(e) {
    if(!this.state.isPressed) return;
    e.preventDefault();
    this._handleMove(e);
  },

  _handleMove({pageX, pageY}) {
    this.setState({x: pageX - this._startX, y: pageY - this._startY});
  },

  _handleMouseUp() {
    if(this.state.isPressed === true){
      this.setState({isPressed: false, x: 0, y: 0});
      this._startX = 0;
      this._startY = 0;

      Actions.endDrag();
    }
  },
});

export default Drag;
