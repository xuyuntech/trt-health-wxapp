import {TABBAR_URLS} from '../const';

var handleTabbarChange = function ({detail}) {
	this.props.store.current = detail.key;
	wx.redirectTo({
		url: TABBAR_URLS[detail.key],
	});
};

module.exports = {
	handleTabbarChange,
};
