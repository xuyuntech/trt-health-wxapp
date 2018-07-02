
import { request } from '../../utils';
import { API } from '../../const';
import { observer } from '../../libs/observer';
import store from './store';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page(observer(
	{
		props: {
			store,
		},
		handleChange({detail: {key}}) {
			this.props.store.current = key;
		},
		checkLogin() {
			if (!app.isLogin()) {
				setTimeout(() => {
					this.checkLogin();
				}, 1000);
			}
			else {
				wx.switchTab({url: '/pages/hospitals/index'});
			}
		},
		async onLoad() {
			await delay();
			this.checkLogin();
			// try {
			// 	const data = await request({
			// 		url: API.Hospitals.Query(),
			// 	});
			// 	console.log(data);
			// 	store.hospitals = (data.results || []).map((item) => ({
			// 		...item,
			// 		link: `/pages/hospitalDetail/index?id=${item.id}`,
			// 		phone: item.phone1 ? `${item.phone1}-${item.phone2}` : item.phone2,
			// 	}));
			// }
			// catch (err) {
			// 	console.error(err);
			// }
		},
	},
));
