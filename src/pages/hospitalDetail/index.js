
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
		async onLoad(options) {
			const { dep1, dep2, hospital } = options;
			await delay();
			try {
				const data = await request({
					url: API.Hospitals.FindByID(hospital),
				});
				console.log(data);
				store.hospital = {
					...data.result,
				};
				wx.setNavigationBarTitle({
					title: store.hospital.name,
				});
				// fetch doctors
				const department2 = await request({
					url: API.Department2.FindByID(dep2),
				});
				store.doctors = department2.result.doctors.map((item) => ({
					...item,
					link: `/pages/doctorDetail/index?name=${item.name}&hospitalID=${store.hospital.id}&dep1=${dep1}&dep2=${dep2}`,
				}));
			}
			catch (err) {
				console.error(err);
			}
		},
		async onLoad1(options) {
			const { id } = options;
			await delay();
			try {
				const data = await request({
					url: API.Hospitals.FindByID(id),
				});
				console.log(data);
				store.hospital = {
					...data.result,
				};
				wx.setNavigationBarTitle({
					title: store.hospital.name,
				});
				// fetch doctors
				const doctors = await request({
					url: API.Doctor.Query(),
				});
				store.doctors = doctors.results.map((item) => ({
					...item,
					link: `/pages/doctorDetail/index?name=${item.name}&hospitalID=${store.hospital.id}`,
				}));
			}
			catch (err) {
				console.error(err);
			}
		},
	},
));
