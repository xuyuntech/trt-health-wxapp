import { observer } from '../../libs/observer';
import { toJS } from '../../libs/mobx';
import store from './store';
import { request } from '../../utils';
import { API } from '../../const';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
const app = getApp(); //  eslint-disable-line no-undef
Page(observer(
	{
		props: {
			store,
		},
		async selectDep1({currentTarget: {dataset: {department}}}) {
			store.selectedDep1ID = department;
			await this.loadDep2(store.selectedDep1ID);
			// store.department2 = store.department1.find((item) =>
			// 	item.id === department).department2s || [];
			store.selectedDep2ID = '';
		},
		selectDep2({currentTarget: {dataset: {department}}}) {
			store.selectedDep2ID = department;
			wx.navigateTo({
				url: `/pages/hospitalDetail/index?hospital=${store.hospitalID}&dep1=${store.selectedDep1ID}&dep2=${store.selectedDep2ID}`,
			});
		},
		async loadDep1(hospital) {
			try {
				store.loadMsg = '加载中...';
				const data = await request({
					url: API.Department1.Query(),
					data: {
						f: 'true',
						hospital,
					},
				});
				store.department1 = data.results || [];
				if (store.department1.length === 0) {
					store.loadMsg = '该医院暂无科室数据';
					return;
				}
				store.loadMsg = '';
			}
			catch (err) { console.error(err); }
		},
		async loadDep2(department1) {
			try {
				store.selectedDep2 = [];
				if (!store.department2[department1]) {
					store.loadDep2Msg = '加载中...';
					const data = await request({
						url: API.Department2.Query(),
						data: {
							f: 'true',
							department1,
						},
					});
					store.department2[department1] = data.results || [];
					if (store.department2[department1].length === 0) {
						store.loadDep2Msg = '暂无科室数据';
						return;
					}
					store.loadDep2Msg = '';
				}
				console.log('store.department2[department1]', toJS(store.department2[department1]));
				store.selectedDep2 = store.department2[department1];
			}
			catch (err) { console.error(err); }
		},
		async onLoad(options) {
			const { hospital } = options;
			store.hospitalID = hospital;
			await delay();
			store.department1 = [];
			store.department2 = [];
			await this.loadDep1(hospital);
			const firstDeps = store.department1[0];
			console.log('firstDeps', firstDeps);
			if (firstDeps && firstDeps.id) {
				store.selectedDep1ID = firstDeps.id;
				await this.loadDep2(store.selectedDep1ID);
			}
		},
		async onLoad1(options) {
			const { hospital = '61cd06e0-7d37-11e8-b8bd-33dbbb63e067' } = options;
			store.hospitalID = hospital;
			await delay();
			store.department1 = [];
			store.department2 = [];
			try {
				store.loadMsg = '加载中...';
				const data = await request({
					url: API.Department1.Query(),
					data: {
						f: 'true',
						hospital,
					},
				});
				store.department1 = data.results || [];
				if (store.department1.length === 0) {
					store.loadMsg = '该医院暂无科室数据';
					return;
				}
				store.loadMsg = '';
				const firstDeps = store.department1[0];
				if (firstDeps && firstDeps.department2s) {
					store.selectedDep1ID = firstDeps.id;
					store.department2 = firstDeps.department2s;
				}
			}
			catch (err) { console.error(err); }
		},
	},
));
