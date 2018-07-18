
import { observer } from '../../libs/observer';
import store from './store';
import { API } from '../../const';
import { request } from '../../utils';

const app = getApp(); //  eslint-disable-line no-undef
Page(observer(
	{
		props: {
			store,
		},
		reAuthorizeConfirm(err) {
			const self = this;
			wx.showModal({
				title: `提示 [${err.status}]`,
				content: `${err}`,
				success({confirm}) {
					if (confirm) {
					}
				},
			});
		},
		getUserInfoSuccess(res) {
			const self = this;
			console.log('userinfo', res);
			const { userInfo } = res;
			const accessToken = wx.getStorageSync('access_token');
			const userID = wx.getStorageSync('user_id');
			// const { accessToken, userID } = authInfo;
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
						self.reAuthorizeConfirm(res.statusCode);
						return;
					}
					if (res.data.status !== 0) {
						console.error('auth/wechat/reg failed', res);
						self.reAuthorizeConfirm(res.data.status);
						return;
					}
					console.log('认证成功:', res.data);
					wx.navigateBack();
				},
			});
		},
		success({detail}) {
			console.log('--- App Login ---');
			const self = this;
			// 登录
			wx.login({
				fail: (err) => {
					console.error('app login failed: ', err);
				},
				success: async (res) => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					console.log('app login success: ', res);
					wx.showLoading();
					const { errMsg, code } = res;
					if (errMsg === 'login:ok') {

						try {
							const res1 = await request({
								url: API.Auth.WechatCallback(code),
							});
							if (!res1.result) {
								console.error('auth failed: ', res);
								return;
							}
							const { accessToken, userID } = res1.result;
							const { userInfo } = detail;
							console.log('accessToken, userID', {accessToken, userID});
							wx.setStorageSync('access_token', accessToken);
							wx.setStorageSync('user_id', userID);
							await request({
								method: 'POST',
								url: API.Auth.WechatReg(),
								data: {
									userInfo,
								},
							});
							console.log('认证成功');
							wx.navigateBack();
						}
						catch (err) {
							console.error(`认证失败:${err}`);
							self.reAuthorizeConfirm(err);
						}

						// wx.request({
						// 	url: API.Auth.WechatCallback(code),
						// 	complete() {
						// 		wx.hideLoading();
						// 	},
						// 	success: function (res) {
						// 		console.log('wechat callback res: ', res);
						// 		const { result } = res.data;
						// 		if (!result) {
						// 			console.error('auth failed: ', res);
						// 			return;
						// 		}
						// 		const { accessToken, userID } = result;
						// 		console.log('accessToken, userID', {accessToken, userID});
						// 		wx.setStorageSync('access_token', accessToken);
						// 		wx.setStorageSync('user_id', userID);
						// 		self.getUserInfoSuccess(detail);
						// 	},
						// 	fail(res) {
						// 		console.log('wechat callback err:', res);
						// 		self.clearStorage();
						// 		self.reAuthorizeConfirm();
						// 	},
						// });
					}
					else {
						console.error('wx.login err', res);
					}
				},
			});
		},
	},
));
