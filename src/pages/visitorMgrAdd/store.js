var extendObservable = require('../../libs/mobx').extendObservable;

/*
realName: '张三',
		gender: '请选择',
		age: '',
		phone: '12399988987',
		sid: '1238893204839204893',
		genderShow: false,
*/

var Store = function () {
	extendObservable(this, {
		visitorID: '',
		mode: '',
		realName: '',
		gender: '请选择',
		age: '',
		phone: '',
		sid: '',
		genderShow: false,
	});
	this.genderList = [
		{name: '请选择', value: 'UNKNOW'},
		{name: '男', value: 'MALE'},
		{name: '女', value: 'FEMALE'},
	];
};

module.exports = new Store();
