import {extendObservable, toJS} from '../../libs/mobx';
import { request } from '../../utils';
import { API } from '../../const';
// var extendObservable = require('../../libs/mobx').extendObservable;
const app = getApp();

var TodoStore = function () {
	extendObservable(this, {
		userInfo: null,
		loaded: false,
	});
	this.loadUserInfo = async function () {
		console.log('load userinfo');
		try {
			const userinfo = await request({
				url: API.Users.UserInfo(),
			}, { autoLogin: false });
			this.userInfo = userinfo.result;
			console.log('this.userInfo', toJS(this.userInfo));
		}
		catch (err) {
			console.error(err);
		}
		this.loaded = true;
	};
};

export default new TodoStore();
