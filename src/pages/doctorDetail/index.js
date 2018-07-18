import moment from 'moment';
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
		openRegisterHistory({currentTarget: {dataset}}) {
			const { registerHistory } = dataset;
			if (!registerHistory) {
				return;
			}
			wx.navigateTo({
				url: `/pages/registerDetail/index?id=${registerHistory}`,
			});
		},
		register({currentTarget: {dataset: {arrangementKey}}}) {
			wx.navigateTo({
				url: `/pages/orderReg/index?arrangementKey=${arrangementKey}`,
			});
		},
		async reloadArrangements() {
			const { hospitalID, dep1, dep2, visitDate } = store.options;
			try {
				// fetch arrangementHistories
				store.loadingMsg = '加载中...';
				store.arrangementHistories = [];
				const data1 = await request({
					url: API.ArrangementHistory.Query(),
					data: {
						f: 'true',
						doctor: store.doctor.name,
						hospital: hospitalID,
						department1: dep1,
						department2: dep2,
						visitDate,
					},
				});
				let arrangementHistories = groupArrangementHistoryByHospital(data1.results);
				console.log('arrangementHistories', arrangementHistories);
				store.arrangementHistories = arrangementHistories;
				if (!store.arrangementHistories.length) {
					store.loadingMsg = '暂无排班信息';
				}
			}
			catch (err) {
				console.error(err);
			}
		},
		async reload() {
			const { name } = store.options;
			store.clear();
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
				this.reloadArrangements();
				// // fetch arrangementHistories
				// store.loadingMsg = '加载中...';
				// const data1 = await request({
				// 	url: API.ArrangementHistory.Query(),
				// 	data: {
				// 		f: 'true',
				// 		doctor: store.doctor.name,
				// 		hospital: hospitalID,
				// 		department1: dep1,
				// 		department2: dep2,
				// 		visitDate,
				// 	},
				// });
				// let arrangementHistories = groupArrangementHistoryByHospital(data1.results);
				// console.log('arrangementHistories', arrangementHistories);
				// store.arrangementHistories = arrangementHistories;
				// if (!store.arrangementHistories.length) {
				// 	store.loadingMsg = '暂无排班信息';
				// }
			}
			catch (err) {
				console.error(err);
			}
		},
		async onLoad(options) {
			store.options = options;
			this.reload();
		},
	},
));
