
import { observer } from '../../libs/observer';
import store from './store';

const app = getApp(); //  eslint-disable-line no-undef
Page(observer(
	{
		props: {
			store,
		},
		success({detail}) {
			app.getUserInfoSuccess(detail);
			console.log('redirectTo');
			wx.switchTab({
				url: '/pages/hospitals/index',
			});
		},
	},
));
