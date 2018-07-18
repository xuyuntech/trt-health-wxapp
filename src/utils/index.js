import moment from 'moment';

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

export function visitDateTime(visitDate, visitTime) {
	return `${moment(visitDate).format('YYYY-MM-DD')} ${visitTime === 'AM' ? '上午' : '下午'}`;
}


let access_token = wx.getStorageSync('access_token');
let user_id = wx.getStorageSync('user_id');

function getRequestHeader() {
	if (!access_token) {
		access_token = wx.getStorageSync('access_token');
	}
	if (!user_id) {
		user_id = wx.getStorageSync('user_id');
	}
	return {
		'X-Access-Token': access_token,
		'X-Access-UserID': user_id,
	};
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
				// ...app.getRequestHeader(),
				...getRequestHeader(),
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
					console.log('401 --->>>');
					// authInfo = null;
					access_token = null;
					user_id = null;
					const app = getApp();
					app.clearStorage();
					app.login();
				}
				else if (data.status !== 0) {
					wx.showModal({
						title: '错误',
						content: JSON.stringify(data, null, '\t'),
						showCancel: false,
					});
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
			visitDateTime: `${moment(item.visitDate).format('YYYY-MM-DD')} ${item.visitTime === 'AM' ? '上午' : '下午'}`,
		});
	});
	return Object.keys(m).map((key) => ({...m[key], hospitalID: m[key].hospital.id}));
}
