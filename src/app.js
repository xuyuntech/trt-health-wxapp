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
	auth: function () {
		const self = this;
		const accessToken = wx.getStorageSync('access_token');
		const userID = wx.getStorageSync('user_id');
		wx.request({
			url: `http://localhost:3000/api/Patient/${userID}`,
			header: {
				'X-Access-Token': accessToken,
			},
			success: function (res) {
				const { statusCode } = res;
				if (statusCode !== 200) {
					self.login();
					return;
				}
				wx.getUserInfo({
					success: (res) => {
						console.log('userinfo', res);
						const { userInfo } = res;
						const { nickName, gender, city, avatarUrl } = userInfo;
						// 可以将 res 发送给后台解码出 unionId
						wx.request({
							method: 'PUT',
							url: `http://localhost:3000/api/Patient/${userID}`,
							header: {
								'X-Access-Token': accessToken,
							},
							data: {
								id: userID,
								name: nickName,
								gender: gender === 1 ? 'MALE' : 'FEMALE',
								avatar: avatarUrl,
							},
							success: function (res) {
								console.log('res>>', res);
							},
						});
					},
				});
			},
		});

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
									// 可以将 res 发送给后台解码出 unionId
									wx.request({
										method: 'HEAD',
										url: `http://localhost:3000/api/Patient/wechat.${userID}`,
										header: {
											'X-Access-Token': accessToken,
										},
										success: function (res) {
											console.log('res>>', res);
											const { statusCode } = res;
											if (statusCode === 200) {
												console.warn('Patient exists already:', userID);

											}
											else if (statusCode === 404) {
												wx.request({
													method: 'POST',
													url: 'http://localhost:3001/auth/add_participant',
													header: {
														'X-Access-Token': accessToken,
													},
													data: {
														userID,
														...userInfo,
													},
													success: function (res) {
														console.log('res>>', res);
													},
												});
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
