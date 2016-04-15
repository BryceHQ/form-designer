import React from 'react';
import _ from 'lodash';
import {TransitionMotion, spring} from 'react-motion';


const _springConfig = {
  slow: {stiffness: 40, damping: 12},
  soft: {stiffness: 80, damping: 12},
  sharp: {stiffness: 200, damping: 25},
  fast: {stiffness: 220, damping: 12},
};

const _transitionConfig = {
  fade: {
    enter: {opacity: 0},
    style: {opacity: spring(1, _springConfig.slow)},
    styleResolver(style) {
      return {
        opacity: style.opacity,
      };
    },
  },

  slideRight: {
    enter: {x: 100},
    style: {x: spring(0, _springConfig.soft)},
    styleResolver(style) {
      return {
        transform: `translate3d(${style.x}%, 0, 0)`,
      };
    }
  },

  slideUp: {
    enter: {x: 100},
    style: {x: spring(0, _springConfig.soft)},
    styleResolver(style) {
      return {
        transform: `translate3d(0, ${style.x}%, 0)`,
      };
    }
  },

  flash: {
    enter: {opacity: 0},
    style: {opacity: spring(1, _springConfig.fast)},
    styleResolver(style) {
      let {opacity} = style;
      if(!opacity) return;
      opacity = Math.floor(opacity);
      return {
        opacity: opacity % 2 === 0 ? 0 : 1,
      };
    },
  },

  bounce: {
    enter: {opacity: 0, scale3d: 0.7},
    style: {opacity: spring(1, _springConfig.fast), scale3d: spring(1, _springConfig.fast)},
    styleResolver(style) {
      return {
        opacity: style.opacity,
        transform: `scale3d(${style.scale3d}, ${style.scale3d}, ${style.scale3d})`,
      };
    },
  },
  zoom: {
    enter: {opacity: 0, scale3d: 0.3},
    style: {opacity: spring(1, _springConfig.sharp), scale3d: spring(1, _springConfig.sharp)},
    styleResolver(style) {
      return {
        opacity: style.opacity,
        transform: `scale3d(${style.scale3d}, ${style.scale3d}, ${style.scale3d})`,
      };
    },
  },


  flip: {
    enter: {x: 0},
    style: {x: spring(10, _springConfig.sharp)},
    styleResolver(style) {
      var x = style.x;
      if(!x)return;
      var timing = x > 5 ? 'ease-out' : 'ease-in';
      return {
        transform: `perspective(400px) translate3d(0, 0, ${(Math.abs(x-5)-5)*30}px) rotate3d(0, 1, 0, ${(x-10)*36}deg) `,
        animationTimingFunction: timing,
      };
    }
  },

  rotate: {
    enter: {deg: 200, opacity: 0},
    style: {deg: spring(0, _springConfig.sharp), opacity: spring(1, _springConfig.sharp)},
    styleResolver(style) {
      return {
        transformOrigin: 'center',
        transform: `rotate3d(0, 0, 1, -${style.deg}deg)`,
        opacity: style.opacity,
      };
    }
  },

  roll: {
    enter: {deg: 120, x: 100, opacity: 0},
    style: {deg: spring(0, _springConfig.sharp), x: spring(0, _springConfig.sharp), opacity: spring(1, _springConfig.sharp)},
    styleResolver(style) {
      return {
        transform: `translate3d(${style.x}%, 0, 0) rotate3d(0, 0, 1, -${style.deg}deg)`,
        opacity: style.opacity,
      };
    }
  },
};

let _transitionTypes = [];
for(var p in _transitionConfig){
  _transitionTypes.push(p);
}

const ComplexTransition = React.createClass({
  propTypes: {
    uniqueKey: React.PropTypes.string.isRequired,
    transition: React.PropTypes.oneOf(_transitionTypes),
  },

  willLeave() {
    return null;//_transitionConfig[this.props.transition].leave;
  },

  willEnter() {
    return _transitionConfig[this.props.transition].enter;
  },

  render() {
    let {children, uniqueKey, transition} = this.props;
    let target = _transitionConfig[transition];
    return (
      <TransitionMotion
        willLeave={this.willLeave}
        willEnter={this.willEnter}
        styles={[{
          key: uniqueKey,
          style: target.style,
        }]}>
        {children.bind(null, target.styleResolver)}
      </TransitionMotion>
    );
  },
});

export default ComplexTransition;
