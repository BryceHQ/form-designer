import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

var Radio = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		inline: React.PropTypes.bool,
		label: React.PropTypes.string
	},

	render() {
    var {label, className, inline} = this.props;
		var componentClass = classNames('x-radio-container', this.props.className);
		var props = _.omit(this.props, 'className', 'label', 'inline');
    var style = {
      display: inline ? 'inline-block' : 'block',
    };

		return (
			<label className={componentClass} style={style}>
				<input type="radio" className="x-radio" {...props} />
				{this.props.label && <span className="x-radio-label">{this.props.label}</span>}
			</label>
		);
	}
});

export default Radio;
