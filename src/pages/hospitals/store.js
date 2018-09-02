var extendObservable = require('../../libs/mobx').extendObservable;

var TodoStore = function () {
	extendObservable(this, {
		current: 'tab1',
		imgUrls: [
			'./../../images/toutu.jpg',
		],
		indicatorDots: false,
		autoplay: false,
		interval: 3000,
		duration: 500,
		loadMsg: '',
		hospitals: [],
	});
};

module.exports = new TodoStore();
