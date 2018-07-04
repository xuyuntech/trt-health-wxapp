export const TABBAR_URLS = {
	GUAHAO: '/pages/index/index',
	MINE: '/pages/mine/index',
	ADMIN: '/pages/admin/index/index',
};

export const GENDER = {
	'UNKNOW': '未知',
	'MALE': '男',
	'FEMALE': '女',
};


const BASE_URL = __DEV__ ? 'http://192.168.1.107:3002' : 'http://api.trt-health.xuyuntech.com';

// o Register // 挂号
//   o Visiting // 就诊中
//   o Finished // 已开处方
export const REGISTER_STATE = {
	Register: '已挂号',
	Visiting: '就诊中',
	Finished: '已开处方',
};

export const API = {
	Auth: {
		WechatCallback: (code) => `${BASE_URL}/auth/wechat/callback?code=${code}`,
		WechatReg: () => `${BASE_URL}/auth/wechat/reg`,
	},
	Users: {
		Login: () => `${BASE_URL}/auth/users/login`,
		FindByID: (id) => `${BASE_URL}/auth/users/${id}`,
	},
	ArrangementHistory: {
		Create: () => `${BASE_URL}/arrangement_history`,
		Query: () => `${BASE_URL}/arrangement_history`,
		FindByID: (id) => `${BASE_URL}/arrangement_history/${id}`,
	},
	Department1: {
		Query: () => `${BASE_URL}/department1`,
	},
	Department2: {
		Query: () => `${BASE_URL}/department2`,
		FindByID: (id) => `${BASE_URL}/department2/${id}`,
	},
	RegisterHistory: {
		Create: () => `${BASE_URL}/register_history`,
		Query: () => `${BASE_URL}/register_history`,
		FindByID: (id) => `${BASE_URL}/register_history/${id}`,
	},
	Visitor: {
		Create: () => `${BASE_URL}/visitor`,
		Query: () => `${BASE_URL}/visitor`,
		FindByID: (id) => `${BASE_URL}/visitor/${id}`,
	},
	Hospitals: {
		Query: () => `${BASE_URL}/hospital`,
		Update: () => `${BASE_URL}/hospital`,
		Create: () => `${BASE_URL}/hospital`,
		FindByID: (id) => `${BASE_URL}/hospital/${id}`,
	},
	Doctor: {
		Query: () => `${BASE_URL}/doctor`,
		Update: (name) => `${BASE_URL}/doctor/${name}`,
		Create: () => `${BASE_URL}/doctor`,
		FindByName: (name) => `${BASE_URL}/doctor/${name}`,
	},
};
