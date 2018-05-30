app.controller('CommoditygoodsSalesCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		/*权限配置*/
		PcService.jurisdictionAction($state.$current.self.url);

		$scope.list = [{}, {}];
		$scope.PcService = PcService;
		

		$scope.searchOption = {
			shopId:$rootScope.ShopId,
			closeMonths:2
		};
		$scope.States = [ {
			Id: 2,
			Name: "2月"
		}, {
			Id: 4,
			Name: "4月"
		}, {
			Id: 6,
			Name: "6月"
		}, {
			Id: 8,
			Name: "8月"
		}, {
			Id: 10,
			Name: "10月"
		}, {
			Id: 12,
			Name: "12月"
		}];
	
		//统计echarts
		var setOptions = function(Content) {
			var myEcharts = document.getElementById("myEcharts");
			var myChart = echarts.init(myEcharts);
			var options = {
				title: {
					text: '店铺最近'+$scope.searchOption.closeMonths+'月核销优惠券统计图'
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
					data: Content.months
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
			console.log(options.legend.data);
			console.log(options.xAxis[0].data);
			console.log('newData',newData)

			myChart.setOption(options, true);
		};

		//统计数据
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.validated+ '?shopId=' + $rootScope.ShopId+'&closeMonths='+$scope.searchOption.closeMonths
				// data:$scope.searchOption
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
		};
	$scope.fetchData()

	
}]);