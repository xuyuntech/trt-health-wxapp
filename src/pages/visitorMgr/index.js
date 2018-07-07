import { request } from '../../utils';
import { API } from '../../const';
import { observer } from '../../libs/observer';
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
		selectVisitor({currentTarget: {dataset}}) {
			if (store.from === 'mine') {
				return;
			}
			// const router = getCurrentPages();
			// const prevPage = router[r(item)r.length - 2];
			const app = getApp(); //  eslint-disable-line no-undef
			const prevPage = app.getPrevPage();
			if (prevPage) {
				prevPage.props.store.selectedVisitor = {
					...store.visitors.find((item) => item.id === dataset.visitorId),
				};
				wx.navigateBack();
			}
		},
		async reload() {
			const app = getApp(); //  eslint-disable-line no-undef
			try {
				const data = await request({
					url: API.Visitor.Query(),
					data: {
						f: 'true',
						creator: app.getUsername(),
					},
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
