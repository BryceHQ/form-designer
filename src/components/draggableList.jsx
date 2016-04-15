import React from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';

import InkBar from 'material-ui/lib/ink-bar';
import Colors from 'material-ui/lib/styles/colors';

import Markdown from './markdown.jsx';

import Actions from '../actions/actions.js';

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 300, damping: 50};
const itemHeight = 150;
const itemWidth = 350;
const {width, height} = window.screen;
const scaleX = (itemWidth/width).toFixed(1);
const scaleY = (itemHeight/height).toFixed(1);
const transformX = -((1 - scaleX) * width / 2).toFixed(0);
const transformY = -((1 - scaleY) * height / 2).toFixed(0);

const DraggableList = React.createClass({
  getDefaultProps() {
    return {data: []};
  },
  getInitialState() {
    return {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      order: _.range(this.props.data.length),
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

  componentWillReceiveProps(nextProps) {
    let data = nextProps.data;
    if(data){
      this.setState({order: _.range(data.length)});
    }
  },

  render() {
    const {data, current} = this.props;
    const {mouse, isPressed, lastPressed, order} = this.state;

    return (
      <div className="draggable-list" ref = "container">
        {_.range(data.length).map(i => {
          const index = order.indexOf(i);
          let currentItem = data[i];
          const style = (lastPressed === i && isPressed) ?
            {
                scale: spring(1.05, springConfig),
                shadow: spring(16, springConfig),
                y: mouse,
              }
            : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                y: spring( index * itemHeight, springConfig),
              };
          const inkbar = current === i ?
            (
              <InkBar left = "0" width = {`${itemWidth}px`} color = {Colors.blue500}
                style = {{
                  height: '5px',
                  position: 'absolute',
                }}
              />
            )
            : null;
          return (
            <Motion style={style} key={currentItem.key}>
              {({scale, shadow, y}) =>
                <div
                  onMouseDown={this._handleMouseDown.bind(null, i, y)}
                  onTouchStart={this._handleTouchStart.bind(null, i, y)}
                  className="draggable-list-item"
                  style={{
                    boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    zIndex: i === lastPressed ? 99 : i,
                  }}>
                  <Markdown mode = "overview" content = {currentItem.content}
                  />
                  {inkbar}
                </div>
              }
            </Motion>
          );
        })}
      </div>
    );
  },

  _handleTouchStart(key, pressLocation, e) {
    this._handleMouseDown(key, pressLocation, e.touches[0]);
  },

  _handleTouchMove(e) {
    e.preventDefault();
    this._handleMove(e.touches[0]);
  },

  _handleMouseDown(pos, pressY, {pageY}) {
    this.setState({
      delta: pageY - pressY,
      mouse: pressY,
      isPressed: true,
      lastPressed: pos,
    });
    this._from = this.state.order.indexOf(pos);
    this._to = this._from;
  },

  _handleMouseMove(e) {
    if(!this.state.isPressed) return;
    e.preventDefault();
    this._handleMove(e);
  },

  _handleMove({pageY}) {
    const {delta, order, lastPressed} = this.state;
    const mouse = pageY - delta;
    const row = clamp(Math.round(mouse / itemHeight), 0, this.props.data.length - 1);
    const newOrder = reinsert(order, order.indexOf(lastPressed), row);
    this.setState({mouse: mouse, order: newOrder});
    this._to = row;
  },

  _handleMouseUp() {
    if(this.state.isPressed === true){
      this.setState({isPressed: false, delta: 0});
      if(this._from !== this._to){
        let me = this;
        window.setTimeout(function(){
          Actions.reinsert(me._from, me._to);
          me._from = me._to = 0;
        }, 300);
      }
      else {
        Actions.selectSlide(this._from);
      }
    }
  },
});

export default DraggableList;
