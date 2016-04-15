import React from 'react';

import classNames from 'classnames';

const Background = React.createClass({

	propTypes: {
    url: React.PropTypes.string,
    className: React.PropTypes.string,
		duang: React.PropTypes.string,
  },

	render() {
    var {className, url, duang} = this.props;
		var componentClass = classNames('background', className);
		var mask = null;
		var style = {
			backgroundImage: `url(${url})`,
		};
		if(duang !== 'clear'){
			mask = (<div className={`bg-${duang}`}></div>);
		}

		return (
			<div className={componentClass}>
        {mask}
				<div className={`bg ${duang}`} style={style}></div>
			</div>
		);
	}
});

export default Background;
