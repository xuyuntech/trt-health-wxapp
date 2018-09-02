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
		showVisitTime() {
			this.props.store.visitTimeShow = true;
		},
		handleVisitTime({detail: {index}}) {
			store.visitTimeIndex = index;
			store.visitTimeLabel = index === 0 ? '上午' : (index === 1 ? '下午' : '请选择');
			this.cancelVisitTime();
		},
		cancelVisitTime() { this.props.store.visitTimeShow = false; },
		visitDateChange({detail: {value}}) {
			store.visitDate = value;
		},
		doctorChange({detail: {value}}) {
			store.doctorIndex = value;
		},
		hospitalChange({detail: {value}}) {
			store.hospitalIndex = value;
		},
		paid() {
			store.paid();
		},
		submit(e) {
			console.log(e);
			const { visitTimeIndex, hospitalIndex, doctorIndex, visitDate } = store;
			console.log({visitTimeIndex, hospitalIndex, doctorIndex, visitDate});
		},
		async onLoad(options) {
			const { id } = options;
			await delay();
			const { selectedDate } = options;
			store.selectedDate = selectedDate;
			store.load(id);
		},
	},
));
