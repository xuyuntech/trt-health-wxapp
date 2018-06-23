var extendObservable = require('../libs/mobx').extendObservable;

var TodoStore = function () {
	extendObservable(this, {
		current: 'register',
		// // observable data
		// todos: [],
		// todoText: 'aaa',
		// // computed data
		// get count() {
		// 	return this.todos.length;
		// },
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
