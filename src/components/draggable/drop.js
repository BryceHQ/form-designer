import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';
import Constants from '../../constants/constants';
import Store from '../../stores/store';


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
      backgroundColor: 'white',
    };
  },

  render() {
    const {children, className, style} = this.props;
    const {backgroundColor} = this.state;

    var newClass = classnames('drop', className);
    var props = _.omit(this.props, ['className', 'target', 'row', 'col', 'style']);
    var dropStyle = {
      backgroundColor: backgroundColor
    };
    return (
      <div ref="target" {...props} className={newClass}
        onDragOver ={this._handleDragOver}
        onDrop={this._handleDrop}
        onDragLeave={this._handleDragLeave}
        style={_.assign(dropStyle, style)}
        >
      </div>
    );
  },

  _handleDrop(event) {
    this.setState({backgroundColor: 'white'});
    if(Store.getData().mode === Constants.MODE.DRAG){
      Actions.endDrag({
        target: this.props.target,
        parent: this.props.parent,
        row: this.props.row,
        col: this.props.col,
      });
    }
    event.stopPropagation();
  },

  _handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    if(this.state.backgroundColor === 'white'){
      this.setState({backgroundColor: Colors.lime100});
    }
  },

  _handleDragEnter() {
    if(Store.getData().mode === Constants.MODE.DRAG && this.state.backgroundColor === 'white'){
      this.setState({backgroundColor: Colors.lime100});
    }
  },
  _handleDragLeave() {
    if(this.state.backgroundColor !== 'white'){
      this.setState({backgroundColor: 'white'});
    }
  },
});

export default Drop;
