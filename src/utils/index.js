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

let authInfo = wx.getStorageSync('auth_info');

function getRequestHeader() {
	if (!authInfo) {
		authInfo = wx.getStorageSync('auth_info');
	}
	const { accessToken, userID, username } = authInfo;
	return {
		'X-Access-Token': accessToken,
		'X-Access-UserID': userID,
		'X-Access-Username': username,
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
					authInfo = null;
					const app = getApp();
					app.clearStorage();
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
