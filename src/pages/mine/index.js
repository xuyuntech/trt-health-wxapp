import { formatTime } from '../../utils';
import { observer } from '../../libs/observer';
import store from './store';

Page(observer(
	{
		props: {
			store,
		},
		onShow() {
			// store.userInfo = getApp().getUserInfo();
		},
		onLoad() {
			store.loadUserInfo();
			this.setData({
				logs: (wx.getStorageSync('logs') || []).map(function (log) {
					return formatTime(new Date(log));
				}),
			});
		},
	},
));
