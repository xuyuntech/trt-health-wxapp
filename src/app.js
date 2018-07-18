import { API } from './const';

let _requestHeader = null;
let _userInfo = null;

App({
	onLaunch: async function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);
		// const authInfo = wx.getStorageSync('auth_info');
		// const userInfo = wx.getStorageSync('user_info');
		// const { accessToken, userID, email, username } = authInfo;
		// if (accessToken) {
		// 	_requestHeader = { accessToken, userID, email, username };
		// 	_userInfo = userInfo;
		// }
	},
	clearStorage() {
		wx.removeStorageSync('access_token');
		wx.removeStorageSync('user_id');
	},
	getPrevPage() {
		const routers = getCurrentPages(); // eslint-disable-line
		const prevPage = routers[routers.length - 2];
		return prevPage;
	},
	login() {
		wx.navigateTo({
			url: '/pages/authorize/index',
		});
	},
});
