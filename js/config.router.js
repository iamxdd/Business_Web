'use strict';

/**
 * Config for the router
 */
app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
	$urlRouterProvider.otherwise('/app/home');
	$stateProvider.state('app', {
			abstract: true,
			url: '/app',
			templateUrl: helper.basepath('app.html'),
			resolve: helper.resolveFor('appCtrl'),
			controller: 'appCtrl'
		})
		.state('app.home', {
			url: '/home',
			templateUrl: helper.basepath('home.html'),
			title: '首页',
			resolve: helper.resolveFor('homeCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
			controller: 'homeCtrl'
		})
		.state('app.auditManagement', {
			url: '/auditManagement',
			title: '商品管理 > 商品列表',
			reload: true,
			templateUrl: helper.basepath('auditManagement.html'),
			resolve: helper.resolveFor('auditManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
			controller: 'auditManagementCtrl'
		})
		.state('app.auditManagementAudit', {
			url: '/auditManagementAudit',
			title: '商品管理 > 商品审核',
			reload: true,
			templateUrl: helper.basepath('auditManagementAudit.html'),
			resolve: helper.resolveFor('auditManagementAuditCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
			controller: 'auditManagementAuditCtrl'
		})
		.state('app.auditManagementDetails', {
			url: '/auditManagementDetails/:object&:type',
			title: '商品详情',
			templateUrl: helper.basepath('auditManagementDetails.html'),
			resolve: helper.resolveFor('auditManagementDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
			controller: 'auditManagementDetailsCtrl'
		})
		.state('app.shelvesManagement', {
			url: '/shelvesManagement',
			title: '商品管理 > 上下架管理',
			templateUrl: helper.basepath('shelvesManagement.html'),
			resolve: helper.resolveFor('shelvesManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'shelvesManagementCtrl'
		})
		.state('app.shelvesManagementDetails', {
			url: '/shelvesManagementDetails/:object',
			title: '商品管理 > 上下架管理 > 上下架详情',
			templateUrl: helper.basepath('shelvesManagementDetails.html'),
			resolve: helper.resolveFor('shelvesManagementDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'shelvesManagementDetailsCtrl'
		})
		.state('app.CommoditySales', {
			url: '/CommoditySales',
			title: '商品统计 > 商品券统计',
			templateUrl: helper.basepath('CommoditySales.html'),
			resolve: helper.resolveFor('CommoditySalesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives','echarts'),
			controller: 'CommoditySalesCtrl'
		})
		.state('app.CommoditygoodsSales', {
			url: '/CommoditygoodsSales',
			title: '商品统计 > 商品核销统计',
			templateUrl: helper.basepath('CommoditygoodsSales.html'),
			resolve: helper.resolveFor('CommoditygoodsSalesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives','echarts'),
			controller: 'CommoditygoodsSalesCtrl'
		})
		.state('app.CommodityStatistics', {
			url: '/CommodityStatistics',
			title: '商品统计 > 商品评价统计',
			templateUrl: helper.basepath('CommodityStatistics.html'),
			resolve: helper.resolveFor('CommodityStatisticsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives','echarts'),
			controller: 'CommodityStatisticsCtrl'
		})
		.state('app.InteManagement', {
			url: '/InteManagement',
			title: '积分管理',
			templateUrl: helper.basepath('InteManagement.html'),
			resolve: helper.resolveFor('InteManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'InteManagementCtrl'
		})
		.state('app.storeInfomation', {
			url: '/storeInfomation',
			title: '店铺信息',
			templateUrl: helper.basepath('storeInfomation.html'),
			resolve: helper.resolveFor('storeInfomationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'storeInfomationCtrl'
		})
		.state('app.ordersManagement', {
			url: '/ordersManagement',
			title: '订单管理',
			templateUrl: helper.basepath('ordersManagement.html'),
			resolve: helper.resolveFor('ordersManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'ordersManagementCtrl'
		})
		.state('app.evaluationManagement', {
			url: '/evaluationManagement',
			title: '评价管理',
			templateUrl: helper.basepath('evaluationManagement.html'),
			resolve: helper.resolveFor('evaluationManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'evaluationManagementCtrl'
		})
		.state('app.evaluationManagementDetail', {
			url: '/evaluationManagementDetail/:object',
			title: '评价管理 > 评价详情',
			templateUrl: helper.basepath('evaluationManagementDetail.html'),
			resolve: helper.resolveFor('evaluationManagementDetailCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'evaluationManagementDetailCtrl'
		})
		// .state('app.Serial', {
		// 	url: '/Serial',
		// 	title: '评价管理 > 序列号验证',
		// 	templateUrl: helper.basepath('Serial.html'),
		// 	resolve: helper.resolveFor('SerialCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
		// 	controller: 'SerialCtrl'
		// })
		.state('app.MemberSetting', {
			url: '/MemberSetting',
			title: '设置 > 成员设置',
			templateUrl: helper.basepath('MemberSetting.html'),
			resolve: helper.resolveFor('MemberSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'MemberSettingCtrl'
		})
		.state('app.PasswordModify', {
			url: '/PasswordModify',
			title: '设置 > 密码修改',
			templateUrl: helper.basepath('PasswordModify.html'),
			resolve: helper.resolveFor('PasswordModifyCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'PasswordModifyCtrl'
		})
		.state('app.PermissionSetting', {
			url: '/PermissionSetting',
			title: '设置 > 权限设置',
			templateUrl: helper.basepath('PermissionSetting.html'),
			resolve: helper.resolveFor('PermissionSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'PermissionSettingCtrl'
		})
		.state('app.exchangeRules', {
			url: '/exchangeRules',
			title: '商品管理 > 用户兑换规则',
			templateUrl: helper.basepath('exchangeRules.html'),
			resolve: helper.resolveFor('exchangeRulesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'exchangeRulesCtrl'
		})
		.state('app.useOfRules', {
			url: '/useOfRules',
			title: '商品管理 > 用户使用规则',
			templateUrl: helper.basepath('useOfRules.html'),
			resolve: helper.resolveFor('useOfRulesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			controller: 'useOfRulesCtrl'
		})
		//

		.state('app.table.static', {
			url: '/static',
			templateUrl: 'views/table_static.html'
		})
		// 
		// Single Page Routes
		// ----------------------------------- 
		.state('page', {
			url: '/page',
			templateUrl: helper.basepath('pages/page.html'),
		})
		.state('page.login', {
			url: '/login',
			title: '用户登录',
			templateUrl: helper.basepath('pages/login.html'),
			resolve: helper.resolveFor('loginCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'md5', 'login-animation'),
			controller: 'loginCtrl'
		})
		.state('access.404', {
			url: '/404',
			templateUrl: 'views/page_404.html'
		})

		.state('apps', {
			abstract: true,
			url: '/apps',
			templateUrl: 'views/layout.html'
		})

		.state('music.playlist', {
			url: '/playlist/{fold}',
			templateUrl: 'views/music.playlist.html'
		})
}]);