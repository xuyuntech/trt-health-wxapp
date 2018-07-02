var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		doctor: null,
		arrangementHistories: [],
	});
};

module.exports = new Store();
