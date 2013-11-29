'use strict';

/* Directives */


angular.module('myApp.directives', [])
.directive('navbar', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/navbar.html',
    transclude: true,
  };
})
.directive('sidebar', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/sidebar.html',
    transclude: true,
  };
})
.directive('chartTable', function(){
  return {
    restrict: 'E',
    templateUrl: 'partials/chart-table.html',
    transclude: true,
  };
})
.directive('iCheck', function($parse){
  return {
    scope: "categories",
    link: function($scope, element, $attrs) {

      var ngModelGetter, value;
      ngModelGetter = $parse($attrs['ngModel']);
      value = $parse($attrs['ngValue'])($scope);

      return $(element).iCheck({
        checkboxClass: "icheckbox_square-blue",
        radioClass: 'iradio_square-blue',
        increaseArea: "20%",
      }).on('ifChanged', function(event) {
        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
          $scope.$apply(function() {
            return ngModelGetter.assign($scope, event.target.checked);
          });
        }
      });
    }
  }
})
.directive("chartBubble", function() {
  return {
    restrict: "E",
    scope: {
      sidebar: "=sidebar"
    },
    link: function($scope, element, $attrs) {
      console.log($scope.sidebar)

      d3.json("data/merchants.json", function(data) {
        var chart = new BubbleChart(data);
        chart.start();
        chart.display_all();

        $scope.$watch("sidebar", function(sidebar) {
          chart.filter_by(sidebar)
        }, true)
      })
    }
  }
})
