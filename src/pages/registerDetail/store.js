import moment from 'moment';
import { request } from '../../utils';
import { API, REGISTER_STATE, GENDER } from '../../const';
import {extendObservable} from '../../libs/mobx';
// var extendObservable = require('../../libs/mobx').extendObservable;
const app = getApp();

var TodoStore = function () {
	extendObservable(this, {
		hospitalIndex: 0,
		doctorIndex: 0,
		visitDate: moment().format('YYYY-MM-DD'),
		listLoadingMsg: '加载中...',

		registerHistory: null,
	});
	this.load = async function (id) {
		try {
			const data = await request({
				url: API.RegisterHistory.FindByID(id),
			});
			const result = data.result || {};
			this.registerHistory = {
				...result,
				visitDateTime: `${moment(result.visitDate).format('YYYY-MM-DD')} ${result.visitTime === 'AM' ? '上午' : '下午'}`,
				stateStr: REGISTER_STATE[result.state],
				visitor: {
					...result.visitor,
					genderStr: GENDER[result.visitor.gender],
				},
				prescription: {
					...result.prescription,
				},
			};
		}
		catch (err) {
			console.error(err);
		}
	};
};

export default new TodoStore();
