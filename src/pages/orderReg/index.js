import { request, visitDateTime } from '../../utils';
import { API } from '../../const';
import { observer } from '../../libs/observer';
import { toJS } from '../../libs/mobx';
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
		// diseaseInfoChange({detail: {detail: {value}}}) {
		// 	store.diseaseInfo = value;
		// },
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
			const self = this;
			const { selectedVisitor, selectedChufuIndex, diseaseInfo } = store;
			if (!selectedVisitor) {
				return wx.showToast({title: '请选择就诊人', icon: 'none'});
			}
			if (selectedChufuIndex < 0) {
				return wx.showToast({title: '请选择初复诊', icon: 'none'});
			}
			const data = {
				visitor: toJS(selectedVisitor),
				type: store.chufuActions[selectedChufuIndex].value,
				diseaseInfo,
				arrangementHistory: store.arrangementHistory.id,
			};
			try {
				const res = await request({
					url: API.Order.Register(),
					method: 'POST',
					data,
				});
				const { registerHistory } = res.result;
				wx.showModal({
					title: '提示',
					content: '预约成功',
					showCancel: false,
					success() {
						self.paySheet(registerHistory);
						// app.getPrevPage().reloadArrangements();
						// wx.navigateBack();
					},
				});
			}
			catch (err) {
				console.error(err);
				wx.showModal({
					title: '操作失败',
					content: `${err}`,
					showCancel: false,
				});
			}
		},
		async paid(registerHistory) {
			try {
				await request({
					url: API.RegisterHistory.Paid(registerHistory),
					method: 'PUT',
				});
				wx.showModal({
					title: '提示',
					content: '操作成功',
					showCancel: false,
					success() {
						app.getPrevPage().reloadArrangements();
						wx.navigateBack();
					},
				});
			}
			catch (err) {
				console.error(err);
				wx.showModal({
					title: '操作失败',
					content: `${err}`,
					showCancel: false,
				});
			}
		},
		paySheet(registerHistory) {
			const self = this;
			wx.showActionSheet({
				itemList: ['线下支付', '微信支付'],
				success: function (res) {
					const { tapIndex } = res;
					console.log(res.tapIndex);
					if (tapIndex === 0) {
						self.paid(registerHistory);
					}
				},
				fail: function (res) {
					console.log(res.errMsg);
				},
			});
		},
		async onLoad(options) {
			const { arrangementKey } = options;
			store.arrangementKey = arrangementKey;
			await delay();
			try {
				const data = await request({
					url: API.ArrangementHistory.FindByID(arrangementKey),
				});
				console.log('arrangementHistory', data);
				store.arrangementHistory = {
					...data.result,
					visitDate: visitDateTime(data.result.visitDate, data.result.visitTime),
				};
			}
			catch (err) {
				console.error(err);
			}
		},
	},
));
