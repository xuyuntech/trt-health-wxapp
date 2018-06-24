import { flow } from 'lodash';
import { observer } from '../../../libs/observer';
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
			const { id } = options;
			await delay();
			wx.setNavigationBarTitle({
				title: id,
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
