import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import ComplexTransition from './common/complexTransition.jsx';

// 使用TransitionMotion代替CSSTransitionGroup，功能更强大
const Slide = React.createClass({
  render() {
    let {transition, uniqueKey, children} = this.props;
    // if(!~_complex.indexOf(transition)){
    //   return (
    //     <CSSTransitionGroup
    //       transitionEnterTimeout = {100}
    //       transitionLeaveTimeout = {100}
    //       className = "slide"
    //       transitionName = {transition}>
    //       {children()}
    //     </CSSTransitionGroup>
    //   );
    // }
    return (
      <ComplexTransition transition={transition} uniqueKey={uniqueKey}>
        {children}
      </ComplexTransition>
    );
  }
});


export default Slide;
