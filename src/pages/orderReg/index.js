import { flow } from 'lodash';
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
		showChufuAction(){
			store.chufuShow = true;
		},
		hideChufuAction(){
			store.chufuShow = false;
		},
		submitChufuAction({detail:{index}}) {
			const action = store.chufuActions[index];
			if (!action){
				return;
			}
			store.selectedChufuIndex = index;
			store.chufuShow = false;
		},
		async onLoad(options) {
			const { arrangementKey } = options;
			await delay();
			wx.setNavigationBarTitle({
				title: arrangementKey || 'null',
			});
			const log = flow(() => {
				console.log('is wechat mini program: ', __WECHAT__);
				console.log('is alipay mini program: ', __ALIPAY__);
				console.log('DEV: ', __DEV__);
			});

			log();
		},
	},
));
