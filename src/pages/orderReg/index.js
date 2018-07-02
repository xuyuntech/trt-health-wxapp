import moment from 'moment';
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
		diseaseInfoChange({detail: {value}}) {
			store.diseaseInfo = value;
		},
		submitDiseaseInfo() {
			store.diseaseInfoModalShow = false;
		},
		cancelDiseaseInfo() {
			store.diseaseInfoModalShow = false;
		},
		showDiseaseInfoModal() {
			store.diseaseInfoModalShow = true;
		},
		showChufuAction() {
			store.chufuShow = true;
		},
		hideChufuAction() {
			store.chufuShow = false;
		},
		submitChufuAction({detail: {index}}) {
			const action = store.chufuActions[index];
			if (!action) {
				return;
			}
			store.selectedChufuIndex = index;
			store.chufuShow = false;
		},
		async submit() {
			const { selectedVisitor, selectedChufuIndex, diseaseInfo } = store;
			if (!selectedVisitor) {
				return wx.showToast({title: '请选择就诊人', icon: 'none'});
			}
			if (selectedChufuIndex < 0) {
				return wx.showToast({title: '请选择初复诊', icon: 'none'});
			}
			const data = {
				visitor: selectedVisitor.id,
				type: store.chufuActions[selectedChufuIndex].value,
				state: 'Register',
				diseaseInfo,
				patient: app.getUsername(),
				arrangementHistory: store.arrangementHistory.id,
			};
			try {
				await request({
					url: API.RegisterHistory.Create(),
					method: 'POST',
					data,
				});
				wx.showToast({title: '挂号成功', icon: 'success'});
				wx.navigateBack();
			}
			catch (err) {
				console.error(err);
			}
		},
		async onLoad(options) {
			const { arrangementKey } = options;
			await delay();
			try {
				const data = await request({
					url: API.ArrangementHistory.FindByID(arrangementKey),
				});
				console.log('arrangementHistory', data);
				store.arrangementHistory = {
					...data.result,
					visitDate: moment(data.result.visitDate).format('YYYY-MM-DD'),
				};
			}
			catch (err) {
				console.error(err);
			}
		},
	},
));
