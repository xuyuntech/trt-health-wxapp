var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		doctors: [],
		loadMsg: '',
	});
};

module.exports = new Store();
