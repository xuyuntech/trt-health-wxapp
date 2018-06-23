var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		doctors: [
			{
				name: '张三',
				title: '主任医师',
				description: '擅长：各种疑难杂症，什么什么什么事没什么没什么什么事',
				reg_count: '1235',
				link: '/pages/doctorDetail/index?id=doctorid',
			},
		],
	});
};

module.exports = new Store();
