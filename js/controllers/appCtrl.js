app.controller('appCtrl', ['$scope', '$http', '$rootScope', '$translate', '$localStorage', '$window', 'uiLoad', 'layerAlert', '$state', 'PcService',
	function($scope, $http, $rootScope, $translate, $localStorage, $window, uiLoad, layerAlert, $state, PcService) {
		// add 'ie' classes to html
		var isIE = !!navigator.userAgent.match(/MSIE/i);
		isIE && angular.element($window.document.body).addClass('ie');
		isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
		//uiLoad.load(["js/directives/base-directivejs", "js/services/base-services.js"]);
		//uiLoad.load(["css/ngDialog.min.css", "css/ngDialog-theme-default.min.css"]);
		// config
		$rootScope.user = {};

		//用户权限控制
		$rootScope.jurisdictionAction = function(name) {
			name = name.substring(1, name.length);
			RolesList = [{
				Id: 1,
				Name: "ShopKeeper"
			}, {
				Id: 2,
				Name: "Manager"
			}, {
				Id: 3,
				Name: "Clerk"
			}, {
				Id: 4,
				Name: "Owner"
			}];
			var roleName = PcService.numberToText($rootScope.RoleId, RolesList);
			$http.get("js/jurisdiction.json").success(function(response) {
				var jurisdictionAction = response;
				var myRoleJurisdictionList = jurisdictionAction[roleName];
				$rootScope.PageJurisdiction = myRoleJurisdictionList[name];
			}).error(function(error) {
				alert(error);
			});
		};
		$scope.app = {
			name: '智慧青龙',
			version: '1.0.0',
			// for chart colors
			color: {
				primary: '#7266ba',
				info: '#23b7e5',
				success: '#27c24c',
				warning: '#fad733',
				danger: '#f05050',
				light: '#e8eff0',
				dark: '#3a3f51',
				black: '#1c2b36'
			},
			settings: {
				themeID: 1,
				navbarHeaderColor: 'bg-black',
				navbarCollapseColor: 'bg-white-only',
				asideColor: 'bg-black',
				headerFixed: true,
				asideFixed: false,
				asideFolded: false,
				asideDock: false,
				container: false
			}
		}

		//退出登录
		$rootScope.exitSystem = function() {
			layerAlert.checkone("选择操作", function() {
				var userInfo = JSON.parse(localStorage.getItem("userInfo"));
				localStorage.clear();
				localStorage.setItem("userInfo", JSON.stringify(userInfo));
				$state.go("page.login");
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定要退出当前系统吗?");

		};

		var myCountInfo = JSON.parse(localStorage.getItem("myCountInfo"));
		var myRoleInfo = JSON.parse(localStorage.getItem("myRoleInfo"));
		var rolesList = JSON.parse(localStorage.getItem("rolesList"));
		var StoreInfo = JSON.parse(localStorage.getItem("StoreInfo"));
		if(!myCountInfo || !StoreInfo) {
			layerAlert.autoclose("登录已过期,请重新登录!");
			setTimeout(function() {
				$state.go("page.login");
			}, 1000);
		} else {
			$rootScope.gHeader = myCountInfo.gHeader;
			$rootScope.pHeader = myCountInfo.pHeader;
			$rootScope.iHeader = myCountInfo.iHeader;
			$rootScope.StoreInfo = StoreInfo;
			$rootScope.ShopId = StoreInfo.ShopList[StoreInfo.selectedIndex].ShopId;
			$rootScope.ShopName = StoreInfo.ShopList[StoreInfo.selectedIndex].ShopName;
			$rootScope.RoleId = StoreInfo.ShopList[StoreInfo.selectedIndex].RoleId;
			/*$rootScope.myRoleInfo = myRoleInfo;*/
			$rootScope.rolesList = rolesList;
			$rootScope.user.name = myCountInfo.name;
			$rootScope.user.memberid = myCountInfo.memberid;
			$rootScope.user.picture = myCountInfo.picture ? myCountInfo.picture : 'img/a0.jpg';
			/*$rootScope.user.job = myRoleInfo.RoleName;*/
		}

		//切换店铺
		$rootScope.changeShop = function(Shop) {
			var e = event || window.event;
			e.stopPropagation();
			if($rootScope.ShopId === Shop.ShopId) {
				layerAlert.autoclose("已经是当前店铺，无须切换！");
				return;
			}
			layerAlert.checkone("确定要切换店铺？", function() {
				$rootScope.ShopId = Shop.ShopId;
				$rootScope.RoleId = Shop.RoleId;
				$rootScope.ShopName = Shop.ShopName;
				var selectedIndex = 0;
				$rootScope.StoreInfo.ShopList.forEach(function(item, index) {
					if(item.ShopId === Shop.ShopId) {
						selectedIndex = index;
					}
				});
				$rootScope.StoreInfo.selectedIndex = selectedIndex;
				localStorage.setItem("StoreInfo", JSON.stringify($scope.StoreInfo));
				if($state.$current.self.name === "app.home") {
					$state.reload("app.home");
				} else {
					$state.go("app.home");
				}

			}, function() {

			}, "确定", "取消", true, true);
		};

		//重新获取菜单列表
		$scope.reGetMemus = function() {
			$rootScope.menuItems = JSON.parse(localStorage.getItem("menuItems"));
			if($rootScope.menuItems && $rootScope.menuItems.length === 0) {

				layerAlert.autoclose("当前角色下暂无任何菜单！");
			}
		};

		$rootScope.changRole = function(x) {
			var myRoleInfo = JSON.parse(localStorage.getItem("myRoleInfo"));
			if(myRoleInfo.RoleCode === x.RoleCode) {
				layerAlert.autoclose("已经是当前角色！");
				return;
			} else {
				localStorage.setItem("myRoleInfo", JSON.stringify(x));
				$rootScope.user.job = x.RoleDescription;
			}
		};

		// save settings to local storage
		if(angular.isDefined($localStorage.settings)) {
			$scope.app.settings = $localStorage.settings;
		} else {
			$localStorage.settings = $scope.app.settings;
		}
		$scope.$watch('app.settings', function() {
			if($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
				// aside dock and fixed must set the header fixed.
				$scope.app.settings.headerFixed = true;
			}
			// save to local storage
			$localStorage.settings = $scope.app.settings;
		}, true);

		// angular translate
		$scope.lang = {
			isopen: false
		};
		$scope.langs = {
			en: 'English',
			de_DE: 'German',
			it_IT: 'Italian'
		};
		$scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
		$scope.setLang = function(langKey, $event) {
			// set the current lang
			$scope.selectLang = $scope.langs[langKey];
			// You can change the language during runtime
			$translate.use(langKey);
			$scope.lang.isopen = !$scope.lang.isopen;
		};

		function isSmartDevice($window) {
			// Adapted from http://www.detectmobilebrowsers.com
			var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
			// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
			return(/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
		}

	}
]);