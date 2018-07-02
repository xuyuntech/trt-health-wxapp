import {extendObservable} from '../../libs/mobx';
// var extendObservable = require('../../libs/mobx').extendObservable;
const app = getApp();

var TodoStore = function () {
	extendObservable(this, {
		userInfo: app.getUserInfo(),
	});
};

export default new TodoStore();
