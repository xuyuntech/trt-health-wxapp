import { request } from '../../utils';
import { API } from '../../const';

var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		visitors: [],
	});
	this.deleteVisitorById = async function (id) {
		console.log('>>>>', id);
		try {
			await request({
				method: 'DELETE',
				url: API.Visitor.DeleteByID(id),
			});
		}
		catch (err) {
			console.error(err);
			wx.showModal({
				title: '错误',
				content: `${err}`,
			});
		}
	};
};

module.exports = new Store();
