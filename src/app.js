import { camelCase } from 'lodash';

App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || [];
		logs.unshift(Date.now());
		wx.setStorageSync('logs', logs);

		const accessToken = wx.getStorageSync('access_token');
		if (!accessToken) {
			this.login();
		}
		else {
			// this.auth();
		}
	},
	login: function () {
		// 登录
		wx.login({
			success: (res) => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				const { errMsg, code } = res;
				if (errMsg === 'login:ok') {
					wx.request({
						url: `http://localhost:3000/auth/wechat/callback?code=${code}`,
						success: function (res) {
							console.log('wechat callback res: ', res);
							const { result } = res.data;
							if (!result) {
								console.error('auth failed: ', res);
								return;
							}
							const { accessToken, userID } = result;
							// const accessToken = data['access-token'];
							// const userID = data['user-id'];
							wx.setStorageSync('access_token', accessToken);
							wx.setStorageSync('user_id', userID);
							wx.getUserInfo({
								success: (res) => {
									console.log('userinfo', res);
									const { userInfo } = res;
									wx.setStorageSync('user_info', userInfo);
									// 可以将 res 发送给后台解码出 unionId
									wx.request({
										method: 'POST',
										url: 'http://localhost:3002/auth/wechat/reg',
										header: {
											'X-Access-Token': accessToken,
											'X-Access-UserID': userID,
										},
										data: {
											userInfo,
										},
										success: function (res) {
											if (res.statusCode !== 200) {
												console.error('auth/wechat/reg error', res);
												return;
											}
											if (res.data.status !== 0) {
												console.error('auth/wechat/reg failed', res);
											}
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
	getUserInfo(cb) {
		if (this.globalData.userInfo) {
			typeof cb === 'function' && cb(this.globalData.userInfo);
		}
		else {
			// 调用登录接口
			wx.login({
				success: () => {
					wx.getUserInfo({
						success: (res) => {
							this.globalData.userInfo = res.userInfo;
							typeof cb === 'function' && cb(this.globalData.userInfo);
						},
					});
				},
			});
		}
	},
	globalData: {
		userInfo: null,
	},
});
