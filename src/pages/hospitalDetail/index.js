
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
		selectVisitDate({currentTarget: {dataset}}) {
			const { visitDate } = dataset;
			if (!visitDate) {
				console.error('visiDate null');
				return;
			}
			store.selectedDate = visitDate;
			this.reload('tab2');
		},
		handleChange({detail: {key}}) {
			this.reload(key);
		},
		async reload(key) {
			const { dep1, dep2, hospital } = this.pageParams || {};
			const visitDate = store.selectedDate;
			let doctors = [];
			this.props.store.current = key;
			store.doctors = [];
			switch (key) {
				case 'tab1':
					doctors = await this.loadByDep2();
					break;
				case 'tab2':
					doctors = await this.loadByVisitDate(visitDate);
			}
			if (doctors.length === 0) {
				store.loadMsg = '暂无医生数据';
				return;
			}
			store.doctors = doctors.map((item) => ({
				...item,
				link: `/pages/doctorDetail/index?name=${item.name}&hospitalID=${hospital}&dep1=${dep1}&dep2=${dep2}${(visitDate && key === 'tab2') ? `&visitDate=${visitDate}` : ''}`,
				reservationQuantity: item.reservationQuantity || 0,
			}));
			store.loadMsg = '';
		},
		async loadByVisitDate(visitDate) {
			const { dep2 } = this.pageParams || {};
			try {
				store.loadMsg = '加载中...';
				// fetch doctors
				const data = await request({
					url: API.ArrangementHistory.Query(),
					data: {
						f: 'true',
						visitDate,
						department2: dep2,
					},
				});
				return data.results.map((item) => item.doctor);
			}
			catch (err) {
				console.error(err);
				wx.showModal({title: '错误', content: String(err)});
			}
			return [];
		},
		async loadByDep2() {
			const { dep2 } = this.pageParams || {};
			try {
				store.loadMsg = '加载中...';
				// fetch doctors
				const department2 = await request({
					url: API.Department2.FindByID(dep2),
				});
				return department2.result.doctors;
			}
			catch (err) {
				console.error(err);
				wx.showModal({title: '错误', content: String(err)});
			}
			return [];
		},
		async onLoad(options) {
			this.pageParams = options;
			await delay();
			this.reload('tab1');
		},
	},
));
