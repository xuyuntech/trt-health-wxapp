import moment from 'moment';
import { request } from '../../utils';
import { API, REGISTER_STATE } from '../../const';
import {extendObservable} from '../../libs/mobx';
// var extendObservable = require('../../libs/mobx').extendObservable;

var TodoStore = function () {
	extendObservable(this, {
		hospitalIndex: 0,
		doctorIndex: 0,
		visitDate: moment().format('YYYY-MM-DD'),
		listLoadingMsg: '',

		registerItems: [],
	});

	this.load = async function () {
		try {
			this.listLoadingMsg = '加载中...';
			const data = await request({
				url: API.RegisterHistory.Query(),
				data: {
					type: 'own',
				},
			});
			const results = data.results || [];
			if (results.length === 0) {
				this.listLoadingMsg = '暂无挂号单数据';
				return;
			}
			this.registerItems = results.map((item) => ({
				...item,
				state: REGISTER_STATE[item.state],
				visitDate: moment(item.visitDate).format('YYYY-MM-DD'),
			}));
			this.listLoadingMsg = '';
		}
		catch (err) {
			console.error(err);
		}
	};
};

export default new TodoStore();
