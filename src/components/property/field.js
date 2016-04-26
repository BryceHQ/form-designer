import React from 'react';
import classnames from 'classnames';

import Textbox from '../common/editor/textbox';

import Actions from '../../actions/actions';


const styles = {
  root: {
    margin: '0.25em 0 ',
    position: 'relative',
  }
};

const Field = React.createClass({
  render() {
    var {label, editable, className, children, labelStyle, style} = this.props;
    var componentClass = classnames('FormField', className);
    var labelElem;
    if(editable){
      labelElem = (
        <Textbox className="FormLabel" value={label} onChange={this._handleLabelChange} style={{width: '100px'}}/>
      );
    } else if(label){
      labelElem = (
        <label className="FormLabel" style={labelStyle}>
          {label}
        </label>
      );
    }
    return (
      <div className={className} style = {_.assign(styles.root, style)}>
        {labelElem}
  			{children}
  		</div>
    );
  },

  _handleLabelChange(value) {
    if(!value || !this.props.owner) return;
    var {owner, label} = this.props;
    if(value !== label){
      owner[value] = owner[label];
      delete owner[label];

      Actions.valueChange();
    }
  },
});

export default Field;
