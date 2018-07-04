
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
		async reload() {
			try {
				const data = await request({
					url: API.Hospitals.Query(),
				});
				console.log(data);
				store.hospitals = (data.results || []).map((item) => ({
					...item,
					link: `/pages/department/index?hospital=${item.id}`,
					phone: item.phone1 ? `${item.phone1}-${item.phone2}` : item.phone2,
				}));
			}
			catch (err) {
				console.error(err);
			}
		},
		async onLoad() {
			await delay();
			// console.log('app.isLogin()', app.isLogin());
			app.startCallback = this.reload;
			this.reload();
			// if (await app.isLogin()) {
			// 	this.reload();
			// }
			// else {
			// 	console.log('app not login');
			// 	app.startCallback = this.reload;
			// }
		},
	},
));
