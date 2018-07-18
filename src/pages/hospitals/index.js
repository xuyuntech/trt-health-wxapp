
import { request } from '../../utils';
import { API, HospitalGrade } from '../../const';
import { observer } from '../../libs/observer';
import store from './store';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
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
				store.hospitals = [];
				store.loadMsg = '医院列表加载中...';
				const data = await request({
					url: API.Hospitals.Query(),
				});
				console.log(data);
				store.hospitals = (data.results || []).map((item) => ({
					...item,
					link: `/pages/department/index?hospital=${item.id}`,
					gradeStr: HospitalGrade[item.grade],
					phone: item.phone1 ? `${item.phone1}-${item.phone2}` : item.phone2,
					reservationQuantity: item.reservationQuantity || 0,
				})).sort((a, b) => {
					if (a.reservationQuantity > b.reservationQuantity) {
						return -1;
					}
					else if (a.reservationQuantity < b.reservationQuantity) {
						return 1;
					}
					else {
						return 0;
					}
				});
				if (store.hospitals.length === 0) {
					store.loadMsg = '暂无医院数据';
					return;
				}
				store.loadMsg = '';
			}
			catch (err) {
				console.error('query hospital', err);
			}
		},
		async onLoad() {
			await delay();
			// console.log('app.isLogin()', app.isLogin());
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
