var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		loadingMsg: '加载中...',
		current: 'tab1',
		doctor: null,
		arrangementHistories: [],
	});
	this.clear = function () {
		this.doctor = null;
		this.arrangementHistories = [];
	};
};

module.exports = new Store();
