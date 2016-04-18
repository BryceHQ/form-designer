import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';
import Store from '../../stores/store';
import Constants from '../../constants/constants';


const Drag = React.createClass({
  propTypes: {
    dragType: React.PropTypes.string,
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
    const {children, uniqueKey, className, style} = this.props;
    const {opacity} = this.state;
    var newClass = classnames('drag', className);
    var props = _.omit(this.props, ['parent', 'target', 'dragType', 'row', 'col', 'style']);
    var dragStyle = {
      boxShadow: `rgba(0, 0, 0, 0.2) 0px 1px 2px 0px`,
      opacity: opacity,
    };
    return(
      <div ref="target"
        {...props}
        className={newClass}
        draggable={true}
        onDragStart={this._handleDragStart}
        onDragEnd={this._handleDragEnd}
        style={_.assign(dragStyle, style)}>
      </div>
    );
  },

  _handleDragStart(event) {
    this.setState({opacity: 0.3});
    Actions.startDrag({
      parent: this.props.parent,
      target: this.props.target,
      dragType: this.props.dragType,
      row: this.props.row,
      col: this.props.col,
    });
    event.stopPropagation();
  },

  _handleDragEnd(event) {
    if(Store.getData().mode === Constants.MODE.DRAG){
      Actions.endDrag(false);
    }
    if(this.state.opacity !== 1){
      this.setState({opacity: 1});
    }
    event.stopPropagation();
  },
});

export default Drag;
