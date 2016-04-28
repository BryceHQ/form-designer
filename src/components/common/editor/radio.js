import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

var Radio = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		inline: React.PropTypes.bool,
		label: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			inline: true,
		};
	},

	render() {
    var {label, className, inline} = this.props;
		var componentClass = classnames('x-radio-container', className);
		var props = _.omit(this.props, 'className', 'label', 'inline');
    var style = {
      display: inline ? 'inline-block' : 'block',
    };

		return (
			<label className={componentClass} style={style}>
				<input {...props} type="radio" className="x-radio" />
				{label && <span className="x-radio-label">{label}</span>}
			</label>
		);
	}
});

export default Radio;
