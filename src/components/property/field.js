import React from 'react';
import classnames from 'classnames';

import Colors from 'material-ui/lib/styles/colors';
import IconButton from 'material-ui/lib/icon-button';
import IconClear from 'material-ui/lib/svg-icons/content/clear';

import Textbox from '../common/editor/textbox';

import Actions from '../../actions/actions';


const styles = {
  root: {
    margin: '0.25em 0 ',
    position: 'relative',
  },
  rightBtn: {
    width: 25,
    height: 25,
    padding: '0px',
    margin: '0px 3px',
    verticalAlign: 'middle',
    float: 'right',
  },
  svg: {
    width: 18,
    height: 18,
    margin: '0',
    verticalAlign: 'middle',
  },
};

const Field = React.createClass({
  render() {
    var {label, editable, className, children, labelStyle, style} = this.props;
    var componentClass = classnames('FormField', className);
    var labelElem, deleteBtn;
    if(editable){
      labelElem = (
        <Textbox value={label} onChange={this._handleLabelChange} style={{width: 100, minWidth: 100}}/>
      );
      deleteBtn = (
        <IconButton style={styles.rightBtn} iconStyle={styles.svg}
          onTouchTap={this._handleRemove}>
          <IconClear color={Colors.grey500} />
        </IconButton>
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
        {deleteBtn}
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

  _handleRemove() {
    if(this.props.onRemove){
      this.props.onRemove(this.props.index);
    }
  },
});

export default Field;
