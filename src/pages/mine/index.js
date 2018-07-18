import { formatTime } from '../../utils';
import { observer } from '../../libs/observer';
import store from './store';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

Page(observer(
	{
		props: {
			store,
		},
		getUserInfo(res) {
			console.log(res);
		},
		async onShow() {
			await delay();
			if (!store.userInfo) {
				store.loadUserInfo();
			}
		},
	},
));
