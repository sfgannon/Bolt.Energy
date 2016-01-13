var thisApp = angular.module("boltcharts", ["chart.js","ui.router"])
  .config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
    })

    .state('home.embedded', {
        url: '/embedded',
        templateUrl: '/templates/embedded.html'
    })

    .state('home.generated', {
        url: '/generated',
        templateUrl: '/templates/generated.html',
        controller: 'LineCtrl'
    })

  })  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      // colours: ['#778899', '#228b22'],
      datasetFill: false
    });
  }])

  .controller("LineCtrl", [ '$scope', '$http', '$q', function ($scope, $http, $q) {
    $scope.chartType = "";
    $scope.data = {};

    $http({
      method: 'GET',
      url: 'http://api.eia.gov/series/?series_id=SEDS.TEPRB.US.A;SEDS.REPRB.US.A&api_key=391D53503414935F30997F6DDC1CD474'
    }).then(function(responseData) {

      var labels = [];
      var dataSeries1 = [];
      var dataSeries2 = [];

      var deltaDataSeries1 = [];
      var deltaDataSeries2 = [];

      var labelGap = 5;
      var AllPower60 = responseData.data.series[0].data.reverse()[0][1];
      var SolarPower60 = responseData.data.series[1].data.reverse()[0][1];

      for (i = 0; i < responseData.data.series[0].data.length; i++) {
        labels.push(responseData.data.series[0].data[i][0]);
        var currentVal = responseData.data.series[0].data[i][1];
        var val = currentVal/AllPower60;
        deltaDataSeries1.push(val);

        dataSeries1.push(currentVal);
        dataSeries2.push(responseData.data.series[1].data[i][1]);

        currentVal = responseData.data.series[1].data[i][1];
        var val = currentVal/SolarPower60;
        deltaDataSeries2.push(val);        
      }

      $scope.series = [responseData.data.series[0].name, responseData.data.series[1].name];
      $scope.series2 = [responseData.data.series[0].name, responseData.data.series[1].name];
      $scope.labels = labels;
      $scope.labels2 = labels;

      $scope.data = [dataSeries1, dataSeries2];
      $scope.data2 = [deltaDataSeries1,deltaDataSeries2];

      //Manual Chart Config
      $scope.chartLineType = "LINE";
      $scope.chartLineData = {
        labels: labels,
        datasets: [{
          label: "Total Generation",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: dataSeries1
        },
        {
          label: "Solar Generation",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: dataSeries2
        }]
      };

      console.log(responseData);
    }, function(responseError) {
      //error callback
      console.log(responseError);
    })

    $http({
      method: 'get',
      url: 'http://api.eia.gov/series/?series_id=ELEC.PRICE.US-RES.M;ELEC.PRICE.US-COM.M;ELEC.PRICE.US-IND.M;ELEC.PRICE.US-TRA.M&api_key=391D53503414935F30997F6DDC1CD474'
    }).then(function(responseData) {
      var labels = [];
      var seriesNames = [];
      var dataSeries1 = [];
      var dataSeries2 = [];
      var dataSeries3 = [];
      var dataSeries4 = [];

      labelGap = 11;
      labelCount = 0;

      var series1 = responseData.data.series[0].data.reverse();
      var series2 = responseData.data.series[1].data.reverse();
      var series3 = responseData.data.series[2].data.reverse();
      var series4 = responseData.data.series[3].data.reverse();


      for (i = 0; i < series1.length; i++) {
        if (labelCount == labelGap) {
          labels.push(series1[i][0]);
          labelCount = 0;
        } else {
          labels.push('');
          labelCount += 1;
        };
        dataSeries1.push((series1[i][1])?(series1[i][1]):(''));
        dataSeries2.push((series2[i][1])?(series2[i][1]):(''))
        dataSeries3.push((series3[i][1])?(series3[i][1]):(''))
        dataSeries4.push((series4[i][1])?(series4[i][1]):(''))
      }

      $scope.series3 = [responseData.data.series[0].name, responseData.data.series[1].name, responseData.data.series[2].name, responseData.data.series[3].name];
      $scope.data3 = [dataSeries1, dataSeries2, dataSeries3, dataSeries4];
      $scope.labels3 = labels;
    })

  // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  // $scope.series = ['Series A', 'Series B'];
  // //EPA EIA API Key - 391D53503414935F30997F6DDC1CD474
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
}])

.directive("chartDirective", [
  function () {
    return {
      restrict: "A",
      scope: {
        chartData: "=chartData",
        chartType: "=chartType"
      },
      link: function(scope, element, attrs) {
        scope.$watch('chartData', function(newValue) {
          if (scope.chartType) {
            switch (scope.chartType.toLowerCase())
            {
              case "bar":
                var ctx = element[0].getContext("2d");
                var myNewChart = new Chart(ctx).Bar(scope.chartData);
                break;
              case "line":
                var ctx = element[0].getContext("2d");
                var myNewChart = new Chart(ctx).Line(scope.chartData);
                element.append(myNewChart.generateLegend());
                break;
              default:
                break;
            }
          }
        }, true)
      }
    }
  }
]);










/*controller("LineCtrl", function ($scope, svcData) {
  
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  //EPA EIA API Key - 391D53503414935F30997F6DDC1CD474
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.message = svcData.getMessage();
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
});

thisApp.factory("svcData", function($http) {
	var retVal = {};
	retVal.getMessage = function() {
		var msg = "This message was delivered in the factory.";
		return msg;
	};
	return retVal;
})*/