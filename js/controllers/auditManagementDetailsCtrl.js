app.controller('auditManagementDetailsCtrl', ['$scope', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {

		/*权限配置*/
		PcService.jurisdictionAction($state.$current.self.url);
		var shopId = $rootScope.ShopId;
		$scope.DetailsData = {};
		$scope.showText = false;
		$scope.showWorth = false;
		//选中礼品券
		$scope.selectCouponType = function(CouponType) {
			if(CouponType === 4) {
				$scope.showWorth = true;
			} else {
				$scope.showWorth = false;
			}
		};
		$scope.ticketCategoryCodes = [{
			Name: '折扣券',
			Id: 1
		}, {
			Name: '抵用券',
			Id: 2
		}, {
			Name: '满减券',
			Id: 3
		}, {
			Name: '礼品券',
			Id: 4
		}];
		var _object = JSON.parse($stateParams.object);
		$scope.type = $stateParams.type;

		//根据Id获取优惠券（商品）详情
		$scope.getDetailsData = function() {
			var id;
			if(typeof _object === "number") {
				id = _object;
			} else {
				id = _object.Id;
			}
			$scope.listBusyPromise = $http({
				method: "get",
				url: serverUrls.getcoupont + "?id=" + id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.DetailsData = response.Content;
					if($scope.DetailsData.Way == 1) { //普通商品
						$scope.UseTimeRange = $scope.DetailsData.UseTimeRange;
					} else { //活动商品
						$scope.UseTimeRangeO = $filter('date')($scope.DetailsData.StartAt, "yyyy-MM-dd HH:mm");
						$scope.UseTimeRangeT = $filter('date')($scope.DetailsData.EndAt, "yyyy-MM-dd HH:mm");
					}
					var imgList = $scope.DetailsData.Images;
					if(imgList != '') {
						imgList = imgList.split(",");
						$scope.DetailsData.imgList = imgList.slice(0, 4);
					}
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};
		$scope.getDetailsData();
		//数字转文字
		$scope.numberToText = function(id, _arrry) {
			var _text = "";
			_arrry.forEach(function(item, index) {
				if(typeof id === "boolean") {
					id = id.toString();
				}
				if(item.Id === id) {
					_text = item.Name;
				}
			});
			_text = _text === "全部" ? "" : _text;
			return _text;
		};
		//状态
		$scope.statusSlect = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '待审核',
			Id: 1
		}, {
			Name: '已通过',
			Id: 2
		}, {
			Name: '未通过',
			Id: 3
		}];
		//范围
		$scope.RangeSelect = [{
			Id: 1,
			Name: "全部商品"
		}, {
			Id: 2,
			Name: "部分商品"
		}]

		$scope.wayScope = [{
			Name: '普通商品',
			Id: 1
		}, {
			Name: '活动商品',
			Id: 1
		}];

		//审核状态样式
		$scope.statusClass = function(value) {
			var statusClass = ''
			switch(value) {
				case 1:
					statusClass = 'todoAudit';
					break;
				case 2:
					statusClass = 'passAudit';
					break;
				case 3:
					statusClass = 'noAudit';
					break;
				case 4:
					statusClass = 'noSubmit';
					break;

				default:
					break;
			}
			return statusClass;
		};
		$scope.deleteItem = function() {

			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.decoupon + '?id=' + $scope.DetailsData.Id + "&shopId=" + shopId,
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					var Content = response.Content;
					if(Code === 0) {
						layerAlert.autoclose('删除操作成功');
						$state.go("app.auditManagement", {
							reload: true
						});
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定要删除吗?");
		};
		$scope.toggleText = function() {
			var _text = "";
			switch($scope.DetailsData.ReviewState) {
				case 1:
					_text = "撤销";
					break;
				case 4:
					_text = "提交";
					break;
				case 3:
					_text = "提交";
					break;
				default:
					break;
			}
			return _text;

		};
		//文本颜色
		$scope.spanClass = function(value) {
			var statusClass = ''
			switch(value) {
				case 1:
					_text = "撤销";

					break;
				case 4:
					_text = "提交";
					break;
				case 3:
					_text = "提交";
					break;
				default:
					break;
			}
			return _text;
		};

		$scope.isToggle = function() {
			return {
				'btn-danger': $scope.DetailsData.ReviewState === 1 || $scope.DetailsData.ReviewState === 3,
				'btn-success': $scope.DetailsData.ReviewState === 4
			};
		};
		//提交和撤回
		$scope.toggleItem = function() {
			var state = 0;
			var stateText = "";
			switch($scope.DetailsData.ReviewState) {
				case 1:
					state = 2;
					stateText = "撤销";
					break;
				case 4:
					state = 1;
					stateText = "提交";
				case 3:
					state = 1;
					stateText = "提交";
				default:
					break;
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.issubmit + "?id=" + $scope.DetailsData.Id + "&state=" + state + "&shopId=" + shopId
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(stateText + "操作成功!");
					$scope.getDetailsData($scope.DetailsData.Id);
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};

		$scope.during = [{
			Id: 0,
			Name: "时间不限"
		}, {
			Id: 1,
			Name: "星期一"
		}, {
			Id: 2,
			Name: "星期二"
		}, {
			Id: 3,
			Name: "星期三"
		}, {
			Id: 4,
			Name: "星期四"
		}, {
			Id: 5,
			Name: "星期五"
		}, {
			Id: 6,
			Name: "星期六"
		}, {
			Id: 7,
			Name: "星期天"
		}];
		//检验名称
		var DevNameCheck = function(val) {
			var flag = true;
			var patternName = /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,32}$/;
			if(patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};
		var numberCheck = function(val) {
			var flag = true;
			var patternName = /(^[1-9]\d*$)/;
			if(patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};
		//上传图片确认
		$scope.configImageAfterUploadOne = function(url) {
			if(url) {
				$scope.editorData.ImagesOne = url;
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}

		};
		$scope.configImageAfterUploadTwo = function(url) {
			if(url) {
				$scope.editorData.ImagesTwo = url;
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}

		};
		$scope.configImageAfterUploadThree = function(num, url) {

			if(url) {
				$scope.editorData.ImagesThree = url;
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}
		};
		$scope.configImageAfterUploadFour = function(url) {

			if(url) {
				$scope.editorData.ImagesFour = url;
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}
		};
		//初始化弹框里面的时间
		//初始化多选下拉控件
		var initMutiSelct = function() {
			setTimeout(function() {
				$('#maxOption2').selectpicker({
					noneSelectedText: $scope.DetailsData.UseTimeRange //默认显示内容 
				});
				$('#maxOption2').attr("title", $scope.editorData.UseTimeRange);
				var _button = $('#maxOption2').siblings("button");
				_button.on("click", function(event) {
					event = event || window.event;
					event.stopPropagation();
					$(this).parent().toggleClass("open");
				});
				$(document).click(function(e) {
					_button.parent().removeClass("open");
				});

			}, 100);
		};
		var initTimeSelct = function() {
			setTimeout(function() {
				//时间插件  开始时间	
				$("#startTime").datetimepicker({
					language: 'zh-CN',
					weekStart: 1,
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					format: "yyyy-mm-dd hh:ii",
					showMeridian: 1
				}).on("click", function(ev) {
					$("#startTime").datetimepicker();
				});

				//时间插件  结束时间	
				$("#endTime").datetimepicker({
					language: 'zh-CN',
					weekStart: 1,
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					format: "yyyy-mm-dd hh:ii",
					showMeridian: 1
				}).on("click", function(ev) {
					$("#endTime").datetimepicker();
				});
			}, 100);
		};
		var MutiSelct = function($scope) {

			initMutiSelct();
			initTimeSelct();
		};
		//修改
		$scope.editorItem = function() {
			$scope.editorData = angular.copy($scope.DetailsData);
			if($scope.DetailsData.Way == 1) { //普通商品
				$scope.editorData.Type = '1';

			} else { //活动商品
				$scope.editorData.Type = '2';
				if($scope.editorData.StartAt != '') {
					$scope.editorData.StartAt = $filter('date')($scope.editorData.StartAt, "yyyy-MM-dd HH:mm");
					$scope.editorData.EndAt = $filter('date')($scope.editorData.EndAt, "yyyy-MM-dd HH:mm");

				}
			}
			$scope.editroeDefaultImageSrc = $scope.DetailsData.Images;
			//普通商品，绑定时间
			var imgList = $scope.DetailsData.Images;
			if($scope.editroeDefaultImageSrc != '') {
				imgList = imgList.split(",");
				imgList = imgList.slice(0, 4);
				$scope.editorData.ImagesOne = imgList[0];
				$scope.editorData.ImagesTwo = imgList[1];
				$scope.editorData.ImagesThree = imgList[2];
				$scope.editorData.ImagesFour = imgList[3];
			}

			ngDialog.openConfirm({
				template: 'createTwo',
				scope: $scope,
				controller: ["$scope", function($scope) {
					setTimeout(function() {
						MutiSelct($scope);
					}, 200);
					$scope.formSubmit = function() {
						var UseTimeRange = $('button[data-id="maxOption2"]').attr('title');
						var text = "修改";
						var Worth = 0;
						var param = '';

						var img = '';
						var arr = [];

						if($scope.editorData.ImagesOne != undefined) {
							arr.push($scope.editorData.ImagesOne);

						};
						if($scope.editorData.ImagesTwo != undefined) {
							arr.push($scope.editorData.ImagesTwo);
						};
						if($scope.editorData.ImagesThree != undefined) {
							arr.push($scope.editorData.ImagesThree);
						};
						if($scope.editorData.ImagesFour != undefined) {
							arr.push($scope.editorData.ImagesFour);
						}

						img = arr.join();
						param = {
							"Id": $scope.editorData.Id,
							"Name": $scope.editorData.Name,
							"Range": $scope.editorData.Range,
							"CouponType": $scope.editorData.CouponType,
							"Way": 2,
							"StartAt": $scope.editorData.StartAt,
							"EndAt": $scope.editorData.EndAt,
							"Describe": $scope.editorData.Describe,
							"SuperpositionNum": parseInt($scope.editorData.SuperpositionNum),
							"Images": img,
							"ShopId": shopId,
							"Worth": $scope.editorData.CouponType === 4 ? $scope.editorData.Worth : 0,
							"PointNum": 0,
							"RepositoryCount": $scope.editorData.RepositoryCount
						};
						if(img == '' || $scope.editorData.RepositoryCount == undefined || $scope.editorData.Describe == undefined || $scope.editorData.Describe == '' || $scope.editorData.Name == '' || $scope.editorData.Name == undefined || $scope.editorData.SuperpositionNum == undefined) {
							layerAlert.autoclose("表单提交不能为空!");
							return;
						}
						if($scope.editorData.Name != undefined) {
							var DevNameFlagReceiver = DevNameCheck($scope.editorData.Name.replace(/\s/g, ""));
							if(!DevNameFlagReceiver) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						}
						if($scope.editorData.SuperpositionNum != '') {
							var numberFlag = numberCheck(parseInt($scope.editorData.SuperpositionNum));
							if(isNaN(Number($scope.editorData.SuperpositionNum)) && !numberFlag) {
								layerAlert.autoclose('库存和限购数量为数字且只能为正整数,请重新输入');
								return;
							}
						}
						formsubmitData(text, $scope, param);
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 950

			});
		};
		//表单提交
		var formsubmitData = function(text, $scope, param) {
			var url = serverUrls.upcoupon;
			var method = 'put';
			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: url,
				data: param
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(text + "操作成功！");
					$scope.getDetailsData($scope.DetailsData.Id);
					setTimeout(function() {
						$scope.closeThisDialog();
					}, 1600);
				} else {

					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
	}
]);