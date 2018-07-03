import { request, groupArrangementHistoryByHospital } from '../../utils';
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
		register({target: {dataset: {arrangementKey}}}) {
			wx.navigateTo({
				url: `/pages/orderReg/index?arrangementKey=${arrangementKey}`,
			});
		},
		async onLoad(options) {
			const { name, hospitalID, dep1, dep2 } = options;
			await delay();
			try {
				const data = await request({
					url: API.Doctor.FindByName(name),
				});
				console.log(data);
				store.doctor = {
					...data.result,
				};
				wx.setNavigationBarTitle({
					title: store.doctor.realName,
				});
				// fetch arrangementHistories
				const arrangementHistories = await request({
					url: API.ArrangementHistory.Query(),
					data: {
						f: 'true',
						doctor: store.doctor.name,
						hospital: hospitalID,
						department1: dep1,
						department2: dep2,
					},
				});
				store.arrangementHistories = groupArrangementHistoryByHospital(arrangementHistories.results);
			}
			catch (err) {
				console.error(err);
			}
		},
	},
));
