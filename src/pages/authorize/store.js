var extendObservable = require('../../libs/mobx').extendObservable;

var TodoStore = function () {
	console.log('>>>>>');
	extendObservable(this, {
		current: 'GUAHAO',
		imgUrls: [
			'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
		],
		indicatorDots: false,
		autoplay: false,
		interval: 5000,
		duration: 1000,

		hospitals: [],
	});

	// action
	this.addTodo = function (title) {
		this.todos.push({title: title});
	};

	this.removeTodo = function () {
		this.todos.pop();
	};
};

module.exports = new TodoStore();
