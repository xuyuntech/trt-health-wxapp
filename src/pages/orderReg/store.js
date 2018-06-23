var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		diseaseInfoModalShow: false,
		selectedChufuIndex: -1,
		chufuShow: false,
		chufuActions: [
			{
				name:'出诊',
			},
			{
				name:'复诊',
			},
		],
		diseaseInfo: '',
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
