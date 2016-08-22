/*
* row DragDrop
*/
import React from 'react';
import classnames from 'classnames';
import _ from 'lodash';

import Row from './common/row';

import DragDrop from '../draggable/dragDrop';

const FormRow = React.createClass({
	propTypes: {
		children: React.PropTypes.node.isRequired,
	},
	getDefaultProps () {
		return {
			// gutter: spacing.gutter,
		};
	},
	render() {
		let { className, target, children, ...props } = this.props;
		let componentClass = classnames('Row', className);

		return (
			<DragDrop target={target} style={{paddingLeft: '40px'}}>
				<Row {...props}>
					{children}
				</Row>
			</DragDrop>
		);
	}
});

export default FormRow;
