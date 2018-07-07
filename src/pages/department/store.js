import moment from 'moment';
import { request } from '../../utils';
import {API} from '../../const';
import { toJS } from '../../libs/mobx';

var extendObservable = require('../../libs/mobx').extendObservable;

class Store {
	constructor() {
		extendObservable(this, {
			department1: [],
			department2: [],
			selectedDep1ID: '',
			selectedDep2ID: '',
			loadMsg: '',
		});
	}
	getSelectedDepartment() {
		return {
			department1: toJS(this.department1.find((item) =>
				item.id === this.selectedDep1ID)),
			department2: toJS(this.department2.find((item) =>
				item.id === this.selectedDep2ID)),
		};
	}
}

export default new Store();
