import moment from 'moment';
import { request } from '../../utils';
import { API, REGISTER_STATE } from '../../const';
import {extendObservable} from '../../libs/mobx';
// var extendObservable = require('../../libs/mobx').extendObservable;
const app = getApp();

var TodoStore = function () {
	extendObservable(this, {
		hospitalIndex: 0,
		doctorIndex: 0,
		visitDate: moment().format('YYYY-MM-DD'),
		listLoadingMsg: '加载中...',

		registerItems: [],
	});

	this.load = async function () {
		try {
			const data = await request({
				url: API.RegisterHistory.Query(),
				data: {
					username: app.getUsername(),
				},
			});
			const results = data.results || [];
			this.registerItems = results.map((item) => ({
				...item,
				state: REGISTER_STATE[item.state],
				arrangementHistory: {
					...item.arrangementHistory,
					visitDate: moment(item.arrangementHistory.visitDate).format('YYYY-MM-DD'),
				},
			}));
		}
		catch (err) {
			console.error(err);
		}
	};
};

export default new TodoStore();
