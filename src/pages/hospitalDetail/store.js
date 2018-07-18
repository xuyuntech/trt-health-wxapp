const moment = require('moment');
var extendObservable = require('../../libs/mobx').extendObservable;

const dayInWeek = ['日', '一', '二', '三', '四', '五', '六'];

var Store = function () {
	const today = moment();
	extendObservable(this, {
		current: 'tab1',
		doctors: [],
		loadMsg: '',
		selectedDate: today.format('YYYY-MM-DD'),
		get visitDates() {
			const max = 2 * 7;
			const arr = [today];
			for (let i = 0; i < max; i += 1) {
				arr.push(moment(today).add(i + 1, 'days'));
			}
			return arr.map((item) => ({
				fullDate: item.format('YYYY-MM-DD'),
				date: item.format('MM-DD'),
				day: dayInWeek[item.day()],
			}));
		},
	});
};

module.exports = new Store();
