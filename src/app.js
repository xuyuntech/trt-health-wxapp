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
	setRequestHeaderToStorage({accessToken, userID, userInfo, username, email}) {
		// wx.setStorageSync('access_token', accessToken);
		// wx.setStorageSync('user_id', userID);
		wx.setStorageSync('user_info', userInfo);
		wx.setStorageSync('auth_info', {accessToken, userID, email, username});
	},
	clearStorage() {
		wx.removeStorageSync('user_info');
		wx.removeStorageSync('auth_info');
	},
	setRequestHeader({accessToken, userID, userInfo}) {
		_requestHeader = {
			accessToken,
			userID,
			userInfo,
		};
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
	getRequestHeader() {
		if (!_requestHeader) {
			const authInfo = wx.getStorageSync('auth_info');
			const {accessToken, userID, username, email} = authInfo;
			const userInfo = wx.getStorageSync('user_info');
			_requestHeader = {
				accessToken,
				userID,
				username,
				email,
				userInfo,
			};
		}
		const { accessToken, userID, username } = _requestHeader;
		return {
			'X-Access-Token': accessToken,
			'X-Access-UserID': userID,
			'X-Access-Username': username,
		};
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
							wx.getUserInfo({
								success: (res) => {
									console.log('userinfo', res);
									const { userInfo } = res;
									wx.setStorageSync('user_info', userInfo);
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
											self.start();
										},
									});
								},
							});
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
