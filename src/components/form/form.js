import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';


const Form = React.createClass({
	propTypes: {
	},
	getDefaultProps () {
		return {
		};
	},
	render() {
		var {title} = this.props;
		var titleElem;
		if(title){
			titleElem = (
				<h1 style={{textAlign: 'center'}}>{title}</h1>
			);
		}

		return (
      <form>
				{titleElem}
        {this.props.children}
      </form>
		);
	}
});

export default Form;
