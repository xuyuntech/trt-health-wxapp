import { API } from './const';

let _requestHeader = null;
let _userInfo = null;

App({
	onLaunch: async function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);
		const authInfo = wx.getStorageSync('auth_info');
		const userInfo = wx.getStorageSync('user_info');
		// const isLogin = await this.isLogin();
		// if (!isLogin) {
		// 	this.login();
		// }
		// else {
		// 	this.start();
		// }
		const { accessToken, userID, email, username } = authInfo;
		if (accessToken) {
			_requestHeader = { accessToken, userID, email, username };
			_userInfo = userInfo;
		}
		// if (!accessToken) {
		// 	this.login();
		// }
		// else {
		// _requestHeader = { accessToken, userID, email, username };
		// _userInfo = userInfo;
		// this.start();
		// }
	},
	startCallback: null,
	start() {
		console.log('app.start ...');
		if (!this.startCallback) {
			return;
		}
		this.startCallback();
	},
	clearStorage() {
		wx.removeStorageSync('user_info');
		wx.removeStorageSync('auth_info');
	},
	getPrevPage() {
		const routers = getCurrentPages(); // eslint-disable-line
		const prevPage = routers[routers.length - 2];
		return prevPage;
	},
	getUserInfo() {
		return _userInfo;
	},
	getUsername() {
		return _requestHeader.username;
	},
	getUserID() {
		return _requestHeader.userID;
	},
	getUserInfoSuccess(res) {
		const self = this;
		console.log('userinfo', res);
		const { userInfo } = res;
		wx.setStorageSync('user_info', userInfo);
		const authInfo = wx.getStorageSync('auth_info');
		const { accessToken, userID } = authInfo;
		_userInfo = userInfo;
		// 可以将 res 发送给后台解码出 unionId
		wx.showLoading();
		wx.request({
			method: 'POST',
			url: API.Auth.WechatReg(),
			header: {
				'X-Access-Token': accessToken,
				'X-Access-UserID': userID,
			},
			data: {
				userInfo,
			},
			complete() {
				wx.hideLoading();
			},
			success: function (res) {
				if (res.statusCode !== 200) {
					console.error('auth/wechat/reg error', res);
					return;
				}
				if (res.data.status !== 0) {
					console.error('auth/wechat/reg failed', res);
					return;
				}
				const { username, email } = res.data.result;
				console.log('accessToken, userID, username, email', {accessToken, userID, username, email});
				wx.setStorageSync('auth_info', {
					accessToken, userID, username, email,
				});
				_requestHeader = { accessToken, userID, email, username };
				_userInfo = userInfo;
				self.start();
			},
		});
	},
	login() {
		const self = this;
		// 登录
		wx.login({
			success: (res) => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				wx.showLoading();
				const { errMsg, code } = res;
				if (errMsg === 'login:ok') {
					wx.request({
						url: API.Auth.WechatCallback(code),
						complete() {
							wx.hideLoading();
						},
						success: function (res) {
							console.log('wechat callback res: ', res);
							const { result } = res.data;
							if (!result) {
								console.error('auth failed: ', res);
								return;
							}
							const { accessToken, userID } = result;
							wx.setStorageSync('auth_info', {
								accessToken, userID,
							});
							wx.getUserInfo({
								fail() {
									console.log('getUserInfo failed..');
									wx.redirectTo({
										url: '/pages/authorize/index',
									});
								},
								success: self.getUserInfoSuccess,
							});
						},
						fail(res) {
							console.log('wechat callback err:', res);
						},
					});
				}
				else {
					console.error('wx.login err', res);
				}
			},
		});
	},
});
