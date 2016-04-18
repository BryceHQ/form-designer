import React from 'react';
import classnames from 'classnames';

const styles = {
  root: {
    margin: '0.25em 0 ',
    position: 'relative',
  }
};

const Field = React.createClass({
  render() {
    var {label, className, children, labelStyle, style} = this.props;
    var componentClass = classnames('FormField', className);
    var labelElem = null;
    if(label){
      label = (
        <label className="FormLabel" style={labelStyle}>
          {label}
        </label>
      );
    }
    return (
      <div className={className} style = {_.assign(styles.root, style)}>
        {label}
  			{children}
  		</div>
    );
  },

});

export default Field;
