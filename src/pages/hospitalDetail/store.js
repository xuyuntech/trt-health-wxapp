var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		doctors: [],
	});
};

module.exports = new Store();
