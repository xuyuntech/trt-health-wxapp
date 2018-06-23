var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		visitors: [
			{
				name: '张三',
				gender: 'MALE',
				birthday: '2007-10-10',
				phone: '12399988987',
				sid: '1238893204839204893',
				address: '北京朝阳区望京绿地中心',
			},
		],
	});
};

module.exports = new Store();
