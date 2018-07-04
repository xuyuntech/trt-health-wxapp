var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		loadingMsg: '加载中...',
		current: 'tab1',
		doctor: null,
		arrangementHistories: [],
	});
};

module.exports = new Store();
