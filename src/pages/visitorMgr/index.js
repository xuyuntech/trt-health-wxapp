import { request } from '../../utils';
import { API } from '../../const';
import { observer } from '../../libs/observer';
import { toJS } from '../../libs/mobx';
import store from './store';

const delay = (t = 0) => new Promise((resolve) => setTimeout(resolve, t));

// 获取应用实例
Page(observer(
	{
		props: {
			store,
		},
		add() {
			wx.navigateTo({
				url: '/pages/visitorMgrAdd/index',
			});
		},
		deleteVisitor(e) {
			console.log('e', e);
			const { currentTarget } = e;
			const { dataset } = currentTarget;
			const { visitorId } = dataset;
			const visitor = store.visitors.find((item) => item.id === visitorId);
			wx.showModal({
				title: '提示',
				content: `您确定要删除 ${visitor.realName} 吗`,
				success: async (r) => {
					console.log(r);
					if (r.confirm) {
						await store.deleteVisitorById(visitorId);
						this.reload();
					}
				},
			});
		},
		selectVisitor({currentTarget: {dataset}}) {
			if (store.from === 'mine') {
				wx.navigateTo({
					url: `/pages/visitorMgrAdd/index?mode=edit&visitorID=${dataset.visitorId}`,
				});
				return;
			}
			// const router = getCurrentPages();
			// const prevPage = router[r(item)r.length - 2];
			const app = getApp(); //  eslint-disable-line no-undef
			const prevPage = app.getPrevPage();
			if (prevPage) {
				prevPage.props.store.selectedVisitor = toJS(store.visitors.find((item) => item.id === dataset.visitorId));
				wx.navigateBack();
			}
		},
		async reload() {
			try {
				const data = await request({
					url: API.Visitor.Query(),
				});
				store.visitors = data.results;
			}
			catch (err) {
				console.error(err);
			}
		},
		async onLoad(options) {
			const { from } = options;
			store.from = from;
			await delay();
			this.reload();
		},
	},
));
