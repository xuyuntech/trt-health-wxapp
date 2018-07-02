import moment from 'moment';

const app = getApp();

function formatNumber(n) {
	n = n.toString();
	return n[1] ? n : '0' + n;
}

export function formatTime(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return (
		[year, month, day].map(formatNumber).join('/') +
		' ' +
		[hour, minute, second].map(formatNumber).join(':')
	);
}

export async function request({url, headers, method = 'GET', data}) {
	return new Promise((resolve, reject) => {
		wx.showLoading({
			title: '加载中',
		});
		wx.request({
			method,
			url,
			header: {
				...app.getRequestHeader(),
				...headers,
			},
			data,
			success: function (res) {
				const { data } = res;
				if (res.statusCode !== 200) {
					const err = {
						status: -1,
						...res,
					};
					reject(err);
				}
				else if (data.status === 401) {
					app.login();
				}
				else if (data.status !== 0) {
					reject(data);
				}
				else {
					resolve(data);
				}
			},
			complete: function () {
				wx.hideLoading();
			},
		});
	});
}


export function groupArrangementHistoryByHospital(results) {
	const m = {};
	results.forEach((item) => {
		if (!m[item.hospital.name]) {
			m[item.hospital.name] = {
				hospital: item.hospital,
				arrangementHistories: [],
			};
		}
		m[item.hospital.name].arrangementHistories.push({
			...item,
			visitDate: moment(item.visitDate).format('YYYY-MM-DD'),
			visitTime: item.visitTime === 'AM' ? '上午' : '下午',
		});
	});
	return Object.keys(m).map((key) => ({...m[key], hospitalID: m[key].hospital.id}));
}
