var extendObservable = require('../../libs/mobx').extendObservable;

var Store = function () {
	extendObservable(this, {
		current: 'tab1',
		diseaseInfoModalShow: false,
		selectedChufuIndex: -1,
		chufuShow: false,
		chufuActions: [
			{
				name: '初诊',
				value: 'First',
			},
			{
				name: '复诊',
				value: 'Second',
			},
		],
		visitorsIndex: -1,
		selectedVisitor: null,
		diseaseInfo: '',
		arrangementHistory: null,
	});
};

module.exports = new Store();
