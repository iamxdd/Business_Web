app.controller('loginCtrl', ['$scope', '$rootScope', '$state', 'PcService', 'layerAlert', '$http', 'serverUrls',
	function($scope, $rootScope, $state, PcService, layerAlert, $http, serverUrls) {

		$scope.account = {
			name: "",
			password: ""
		};

		var PcService = {
			errorResult: function(value) {
				var _text;
				if(!value) {
					_text = "网络错误,请检查您的网络！";
				} else if(typeof value === "string") {
					_text = value !== "An error has occurred." ? value : "服务端错误，请联系管理员！";
				} else if(typeof value === "object") {
					if(!!value.Message) {
						_text = value.Message !== "An error has occurred." ? value.Message : "服务端错误，请联系管理员！";
					}
				} else {
					_text = "网络错误,请检查您的网络！";
				}
				return _text;
			}
		};
		$scope.account = {
			name: "",
			password: "",
			remember: true,
			require: true
		};

		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if(userInfo) {
			$scope.account.name = userInfo.count;
			$scope.account.password = userInfo.password;
		}

		$scope.nameRequire = false;
		$scope.passwordRequire = false;

		//获取账户下的角色列表
		var getMyRoles = function(headers) {
			$scope.listBusyPromise = $http({
				headers: headers,
				method: 'get',
				url: serverUrls.getRole
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					var mrRoles = response.Content;
					if(mrRoles.length > 0) {
						var rolesList = mrRoles;
						localStorage.setItem("rolesList", JSON.stringify(rolesList));
						var myRoleInfo = mrRoles[0];
						localStorage.setItem("myRoleInfo", JSON.stringify(myRoleInfo));
						setTimeout(function() {
							$state.go("app.home");
						}, 800);
					} else {
						layerAlert.autoclose("当前账号下，没有任何角色！");
						return;
						setTimeout(function() {
							$state.go("page.login");
						}, 800);
					}
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//获取账号下的店铺信息
		var getMyShopInfo = function(pHeader) {
			$scope.listBusyPromise = $http({
				headers: pHeader,
				method: "get",
				url: serverUrls.GetMyShopList
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					if(!response.Content || response.Content.length === 0) {
						layerAlert.autoclose("当前账号下暂无任何店铺!");
						return;
					}
					$scope.StoreInfo = {};
					$scope.StoreInfo.ShopList = response.Content;
					$scope.StoreInfo.selectedIndex = 0;
					localStorage.setItem("StoreInfo", JSON.stringify($scope.StoreInfo));
					setTimeout(function() {
						$state.go("app.home");
					}, 800);
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//用户登录
		$scope.login = function() {
			$scope.nameRequire = !$scope.account.name;
			$scope.passwordRequire = !$scope.account.password;
			if($scope.nameRequire || $scope.passwordRequire) {
				return;
			}
			var _password = md5($scope.account.password) + "_" + md5(new Date().getTime());
			var name = $scope.account.name;
			var data = {
				name: name,
				password: _password,
				userType: 2
			};

			$scope.listBusyPromise = $http({
				method: 'post',
				url: serverUrls.residentLogin,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.userInfo = response.Content;
					var token = $scope.userInfo.Token;
					$rootScope.gHeader = {
						'Content-Type': 'undefined',
						"Authorization": "Bearer " + token,
						"Accept": "application/json"
					};
					$rootScope.pHeader = {
						'Content-Type': "application/json",
						"Authorization": "Bearer " + token,
						"Accept": "application/json"
					};
					$rootScope.iHeader = {
						"Authorization": "Bearer " + token,
						"Accept": "application/json"
					};
					var myCountInfo = {
						gHeader: $rootScope.gHeader,
						pHeader: $rootScope.pHeader,
						iHeader: $rootScope.iHeader,
						name: $scope.userInfo.Name,
						memberid: $scope.userInfo.IdentityCode,
						picture: $scope.userInfo.Images ? $scope.userInfo.Images : 'app/img/user/08.jpg',
						token: token,
					};
					localStorage.setItem("myCountInfo", JSON.stringify(myCountInfo));
					if($scope.account.remember) {
						var userInfo = {
							count: $scope.account.name,
							password: $scope.account.password,
							memberid: $scope.userInfo.IdentityCode
						};

						localStorage.setItem("userInfo", JSON.stringify(userInfo));
					} else {
						localStorage.removeItem("userInfo");
					}
					layerAlert.autoclose("登录成功，正在获取店铺信息..");
					getMyShopInfo($rootScope.gHeader);
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
	}
]);