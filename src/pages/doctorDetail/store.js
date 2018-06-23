var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		arrangement_list: [
			{
				hospitalID: 'id',
				hospital: {
					name: '河东路店',
				},
				list: [
					{
						visitDate: '2018-05-23 周三 3天后',
						price: '80.00',
						arrangementKey: 'arrangementKey',
					},
				],
			},
		],
	});
};

module.exports = new Store();
