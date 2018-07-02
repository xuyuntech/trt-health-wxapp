var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		visitors: [],
	});
};

module.exports = new Store();
