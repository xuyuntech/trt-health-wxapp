import {extendObservable, toJS} from '../../libs/mobx';
import { request } from '../../utils';
import { API } from '../../const';
// var extendObservable = require('../../libs/mobx').extendObservable;
const app = getApp();

var TodoStore = function () {
	extendObservable(this, {
		userInfo: null,
	});
	this.loadUserInfo = async function () {
		try {
			const userinfo = await request({
				url: API.Users.UserInfo(),
			});
			this.userInfo = userinfo.result;
			console.log('this.userInfo', toJS(this.userInfo));
		}
		catch (err) {
			console.error(err);
		}
	};
};

export default new TodoStore();
