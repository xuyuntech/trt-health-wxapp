import { observer } from '../../libs/observer';
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
		selectDep1({currentTarget: {dataset: {department}}}) {
			store.selectedDep1ID = department;
			store.department2 = store.department1.find((item) =>
				item.id === department).department2s || [];
			store.selectedDep2ID = '';
		},
		selectDep2({currentTarget: {dataset: {department}}}) {
			store.selectedDep2ID = department;
			wx.navigateTo({
				url: `/pages/hospitalDetail/index?hospital=${store.hospitalID}&dep1=${store.selectedDep1ID}&dep2=${store.selectedDep2ID}`,
			});
		},
		async onLoad(options) {
			const { hospital = '61cd06e0-7d37-11e8-b8bd-33dbbb63e067' } = options;
			store.hospitalID = hospital;
			await delay();
			try {
				const data = await request({
					url: API.Department1.Query(),
					data: {
						f: 'true',
						hospital,
					},
				});
				store.department1 = data.results;
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
