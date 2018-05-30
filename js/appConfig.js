// appConfig
var mBaseUrl = "http://192.168.1.249:91/api/gw/";
var rBaseUrl = "http://192.168.1.249:91/res/gw/";
var getNewUrl = function(_string) {
	return mBaseUrl + "api/" + _string + "/api/";
};
var retNewUrl = function(_string) {
	return rBaseUrl + "res/" + _string + "/";
};
var apiAdds0 = getNewUrl("foundation");
var apiAdds1 = getNewUrl("organization");
var apiAdds3 = getNewUrl("information");
var apiAdds4 = getNewUrl("point");
var apiAdds5 = getNewUrl("democratic");
var apiAdds6 = getNewUrl("member");
var apiAdds7 = getNewUrl("event");
var apiAdds8 = getNewUrl("work");
var apiAdds9 = getNewUrl("formdatacenter");
var apiAddsa = getNewUrl("statistics");
var apiAddsb = retNewUrl("media");
var apiAddsc = getNewUrl("coterie");
var apiAddsd = getNewUrl("advertisement");
var apiAddsf = getNewUrl("finances");
var apiAddsg = getNewUrl("construction");
var apiAddsh = getNewUrl("pointmall");
app.constant("serverUrls", {
	fileUpload: apiAddsb + "mediafile/api/upload", //图片上传
	residentLogin: apiAdds0 + "foundation/login", //居民登录

	uppassword: apiAdds0 + "foundation/uppassword", //更新密码
	resetpassword: apiAdds0 + "foundation/resetpassword", //重置密码

	getIdcardno: apiAdds0 + "foundation/getidcardno", //根据居民Id获取居民信息
	AddShopMember: apiAddsh + "pointmall/AddShopMember", //设置之成员新增
	getRole: apiAdds6 + "menubar/getrole", //获取用户下的角色列表
	GetShopBaseInfo: apiAddsh + "pointmall/GetShopBaseInfo", //获取店铺信息
	GetShopHomeStatisticsInfo: apiAddsh + "pointmall/GetShopHomeStatisticsInfo", //获取首页店铺统计信息
	GetStatistics: apiAddsh + "pointmall/statistics", //首页统计数据
	DeleteShopMemberById: apiAddsh + "pointmall/DeleteShopMemberById", //删除店铺成员
	UpdateShopMember: apiAddsh + "pointmall/UpdateShopMember", //修改店铺成员
	GetMyShopList: apiAddsh + "pointmall/GetMyShopList", //获取账户信息
	issubmit: apiAddsh + "pointmall/issubmit", //提交和撤销
	couponorderList: apiAddsh + "pointmall/couponorderlist", //订单列表

	UpdateShopBaseInfo: apiAddsh + "pointmall/UpdateShopBaseInfo", //修改店铺基本信息

	couponlist: apiAddsh + "pointmall/couponlist", //分页获取优惠券商品
	decoupon: apiAddsh + "pointmall/decoupon", //删除审核管理页面的商品
	addcoupon: apiAddsh + "pointmall/addcoupon", //新增优惠券商品
	decoupon: apiAddsh + "pointmall/decoupon", //删除优惠券

	getcoupont: apiAddsh + "pointmall/getcoupont", //根据Id获取优惠券详情
	upcoupon: apiAddsh + "pointmall/upcoupon", //修改优惠券
	GetOrderEvaluationListMerchant: apiAddsh + "pointmall/GetOrderEvaluationListMerchant", //评价列表
	GetOrderEvaluationDetailsById: apiAddsh + "pointmall/GetOrderEvaluationDetailsById", //通过Id获取评论详情
	OrderEvaluationReply: apiAddsh + "pointmall/OrderEvaluationReply", //回复评论

	GetShopMemberListByPage: apiAddsh + "pointmall/GetShopMemberListByPage", //获取店铺成员列表信息
	ChangeShopMemberState: apiAddsh + "pointmall/ChangeShopMemberState", //改变店铺成员状态
	GetShopMemberRoleListByPage: apiAddsh + "pointmall/GetShopMemberRoleListByPage", //分页获取权限设置
	GetShopMemberNameList: apiAddsh + "pointmall/GetShopMemberNameList", //权限设置成员列表
	AddShopMemberRole: apiAddsh + "pointmall/AddShopMemberRole", //权限设置新增
	UpdateShopMemberRole: apiAddsh + "pointmall/UpdateShopMemberRole", //权限设置修改

	decoupon: apiAddsh + "pointmall/decoupon", //删除审核管理页面的商品

	isshelf: apiAddsh + "pointmall/isshelf", //上下架

	UpdateShopMapInfo: apiAddsh + "pointmall/UpdateShopMapInfo", //编辑地图
	vercouponorder: apiAddsh + "pointmall/vercouponorder", //兑换优惠券
	getrecodecoupon: apiAddsh + "pointmall/getrecodecoupon", //优惠券

	creveryaccountclaimList: apiAddsh + "pointmall/creveryaccountclaim/list", //规则列表
	creveryaccountclaim: apiAddsh + "pointmall/creveryaccountclaim", //新增
	creveryaccountuseList: apiAddsh + "pointmall/creveryaccountuse/list", ////规则列表
	creveryaccountuse: apiAddsh + "pointmall/creveryaccountuse", //新增

	//商品统计
	statisticsCoupon: apiAddsh + "statistics/coupon", //新增
	validated: apiAddsh + "statistics/coupon/validated", //新增
	evaluation: apiAddsh + "statistics/coupon/evaluation", //新增
});