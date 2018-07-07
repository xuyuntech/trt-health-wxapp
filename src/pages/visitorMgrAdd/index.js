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
		async add() {
			const { realName, sid, age, phone, gender } = store;
			console.log({realName, sid, age, phone, gender, creator: app.getUsername()});
			if (!realName) {
				return wx.showToast({title: '请填写姓名', icon: 'none'});
			}
			if (!sid) {
				return wx.showToast({title: '请填写身份证号', icon: 'none'});
			}
			if (!phone) {
				return wx.showToast({title: '请填写手机号', icon: 'none'});
			}
			if (!age) {
				return wx.showToast({title: '请填写年龄', icon: 'none'});
			}
			try {
				const data = await request({
					url: API.Visitor.Create(),
					method: 'POST',
					data: {
						realName,
						sid,
						age,
						phone,
						creator: app.getUsername(),
						gender: store.genderList.find((item) => item.name === gender).value,
					},
				});
				console.log(data);
				const p = app.getPrevPage();
				if (p) {
					p.reload();
				}
				wx.navigateBack();
			}
			catch (err) {
				console.error(err);
			}
		},
		valueChange({detail: {detail}, currentTarget}) {
			const { value } = detail;
			const { dataset } = currentTarget;
			store[dataset['name']] = value;
		},
		selectGender() {
			store.genderShow = true;
		},
		confirmGender({detail: {index}}) {
			store.gender = store.genderList[index].name;
			this.cancelGender();
		},
		cancelGender() {
			store.genderShow = false;
		},
		selectVisitor({currentTarget: {dataset}}) {
			const router = getCurrentPages(); // eslint-disable-line
			const prevPage = router[router.length - 2];
			if (prevPage) {
				console.log('oo', {
					...store.visitors.find((item) => item.sid === dataset.visitorSid),
				});
				prevPage.props.store.selectedVisitor = {
					...store.visitors.find((item) => item.sid === dataset.visitorSid),
				};
				wx.navigateBack();
			}
		},
		async onLoad(options) {
			await delay();
		},
	},
));
