import React from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';
import Constants from '../../constants/constants';

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = {stiffness: 120, damping: 20};

const Drop = React.createClass({
  propTypes: {
    // uniqueKey: React.PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
    };
  },

  getInitialState() {
    return {
    };
  },

  componentDidMount() {
    this.refs.target.addEventListener("touchend", this._handleMouseUp);
    this.refs.target.addEventListener("mouseup", this._handleMouseUp);
  },

  componentWillUnmount() {
    this.refs.target.removeEventListener("touchend", this._handleMouseUp);
    this.refs.target.removeEventListener("mouseup", this._handleMouseUp);
  },

  render() {
    const {children, className, ...props} = this.props;
    var componentClass = classnames('drop', className);

    return (
      <div ref="target" {...props} className={componentClass} onMouseEnter={this._handleMouseEnter} onMouseOut={this._handleMouseOut}></div>
    );
  },

  _handleMouseUp(event) {
    if(this.props.mode === Constants.MODE.DRAG){
      Actions.endDrag(this.props.target);
      event.stopPropagation();
      event.preventDefault();
    }
  },

  _handleMouseEnter() {
    console.log('mouse enter');
  },
  _handleMouseOut() {
    console.log('mouse out');
  },
});

export default Drop;
