/*
*	单独文件定义 options，这样在 display 模式就可以不引用这些文件
*/
import config from '../../../config';

const options = {
	name: 'Col',
	attributes: {
		basis: '20%',
		style: {},
		_options: {
			style: {
				keyEditable: true,
				defaultChild: {'':''},
			},
		},
	},
};

export default options;
