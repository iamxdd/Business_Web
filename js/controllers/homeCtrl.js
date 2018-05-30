app.controller('homeCtrl', ['$scope','$state','$rootScope', 'ngDialog', 'PcService', 'layerAlert', '$http', 'serverUrls',
	function($scope, $state,$rootScope, ngDialog, PcService, layerAlert, $http, serverUrls) {
		$scope.Mainheader = [{
				icon: "glyphicon glyphicon-barcode",
				Name: '序列号验证',
				index: 0,
				background: '#2baae3',
				url:'app.ordersManagement'

			},
			{
				icon: "fa fa-comment-o",
				Name: '评价',
				index: 1,
				background: '#2cb87b',
				url:'app.evaluationManagement'
			},
			{
				icon: "fa fa-user",
				Name: '店员',
				index: 2,
				background: '#ffb94b',
				url:'app.MemberSetting'
			},
			{
				icon: "fa fa-bar-chart",
				Name: '数据',
				index: 3,
				background: '#2658a6',
				url:'app.auditManagement'
			}
		];
		$scope.commentData = 0;

		$scope.Commoditymanagement = [{
				CommodityName: '全部商品',
				value: 1
			},
			{
				CommodityName: '上架商品',
				value: 0
			},
			{
				CommodityName: '下架商品',
				value: 1
			},
		];
		$scope.Activitymanagement = [{
				ActivityName: '进行中的活动',
				value: 2
			},
			{
				ActivityName: '未开始的活动',
				value: 1
			},
			{
				ActivityName: '已结束的活动',
				value: 1
			},
		];
       $scope.LinkClick = function(index){
       	$scope.Mainheader.forEach(function(v){
       		if(index==v.index){
       			$state.go(v.url);
       		}
       	})
       	console.log('index',index)
       	   // 
       }
		//新增管理
		$scope.creatOne = function() {
			ngDialog.openConfirm({
				template: 'createOne',
				controller: 'teshurenqunfuwuCtrl',
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false
			});
		};

		//统计echarts
		var setOptions = function(Content) {
			var myEcharts = document.getElementById("myEcharts");
			var myChart = echarts.init(myEcharts);
			var options = {
				title: {
					text: '商品促销统计图'
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: Content.title
				},
				toolbox: {
					show: true,
					feature: {
						dataView: {
							show: true,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					data: Content.month
				}],
				yAxis: [{
					type: 'value'
				}]
			};
			var newData = [];
			for(var i = 0; i < Content.data.length; i++) {
				newData.push({
					name: Content.title[i],
					type: 'bar',
					data: Content.data[i],
				});
			}
			options.series = newData;

			myChart.setOption(options, true);
		};

		//统计数据
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.GetShopHomeStatisticsInfo + '?shopId=' + $rootScope.ShopId,
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;

				if(Code === 0) {
					var _Content = response.Content;
					setOptions(_Content);
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

			$http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.GetStatistics + '?shopId=' + $rootScope.ShopId,
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					var commentData = response.Content;
					$scope.commentNum = commentData.EvaluationNum;
					$scope.Commoditymanagement[0].value = commentData.CouponSum;
					$scope.Commoditymanagement[1].value = commentData.InShelf;
					$scope.Commoditymanagement[2].value = commentData.NotShelf;
					$scope.Activitymanagement[0].value = commentData.InActivity;
					$scope.Activitymanagement[1].value = commentData.PeActivity;
					$scope.Activitymanagement[2].value = commentData.NotActivity;
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		$scope.fetchData();

	}
]);