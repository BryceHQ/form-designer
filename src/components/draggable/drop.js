import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';

import Actions from '../../actions/actions';
import {Mode} from '../../constants/constants';
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
    const {className, style, target, parent, row, col, ...props} = this.props;
    const {backgroundColor} = this.state;

    var componentClass = classnames('drop', className);

    var dropStyle = {
      backgroundColor: backgroundColor
    };
    return (
      <div ref="target" {...props} className={componentClass}
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
    if(Store.getData().mode.equalTo(Mode.DRAG)){
      Actions.endDrag(this.props.target);
    }
    event.stopPropagation();
  },

  _handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    // if(this.state.backgroundColor === 'white'){
    //   this.setState({backgroundColor: Colors.lime100});
    // }
  },

  _handleDragEnter() {
    if(Store.getData().mode.equalTo(Mode.DRAG) && this.state.backgroundColor === 'white'){
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
