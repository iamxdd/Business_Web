app.controller('CommodityStatisticsCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		/*权限配置*/
		PcService.jurisdictionAction($state.$current.self.url);
		$scope.list = [{}, {}];
		$scope.PcService = PcService;
		$scope.couponId=[];
		$scope.searchOption = {
			shopId:$rootScope.ShopId,
			closeMonths:2,
			couponId:"",
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


			//获取优惠券Id
		var getId = function($scope, deffered) {
			var params={
				length:999,
				currentPage:1
			};
			PagerExtends.regListSpecifyPage($scope, {
					apiUrl: serverUrls.couponlist,
					params: params,
					success: function(response) {
						$scope.couponId = response;
						$scope.searchOption.couponId=$scope.couponId[0].Id;
					if(deffered) {
						deffered.resolve("success");
					   }
					
					},
					error: function(error) {
						layerAlert.autoclose(errorResult(error));
					}
				}, $rootScope.pHeader);

		};


		//统计echarts
		var setOptions = function(Content) {
			var myEcharts = document.getElementById("myEcharts");
			var myChart = echarts.init(myEcharts);
			var options = {
				title: {
					text: '店铺最近'+$scope.searchOption.closeMonths+'月评价统计图'
				},
				tooltip: {
					trigger: 'axis',
					formatter:function(params)//数据格式
			            {
			            var relVal = params[0].name+$scope.text+'评价数'+"<br/>";
			            relVal += params[0].seriesName+ ' : ' + params[0].value+"<br/>";
			            relVal +=params[1].seriesName+ ' : ' +params[1].value+"<br/>";
			            relVal += params[2].seriesName+ ' : ' + params[2].value+"<br/>";
			            relVal += params[3].seriesName+ ' : ' + params[3].value+"<br/>";
			            relVal +=params[4].seriesName+ ' : ' +params[4].value+"<br/>";
			            return relVal;
			            }
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

			myChart.setOption(options, true);
		};

		//统计数据
		$scope.fetchData = function() {
			var defered = $q.defer();
			var promises = defered.promise;

			if($scope.couponId.length === 0) {
				getId($scope, defered);
			} else {
				defered.resolve();
			}

			promises.then(function() {
				$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.evaluation+ '?shopId=' + $rootScope.ShopId+'&couponId='+$scope.searchOption.couponId+'&closeMonths='+$scope.searchOption.closeMonths
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				$scope.text='';

				if(Code === 0) {
					var _Content = response.Content;
					$scope.couponId.forEach(function(v){
						if($scope.searchOption.couponId == v.Id){
                            $scope.text=v.Name;
						}
					})
					setOptions(_Content);
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
			}, function(value) {
				console.log(value);
			}, function(value) {
				console.log(value);
			});
			
		};
	$scope.fetchData()

	
}]);