'use strict';


// Declare app level module which depends on filters, and services
// the [] array is for dependency injections
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',

  // third party
  'uiSlider',
  'ui.bootstrap',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
		templateUrl: 'partials/main.html',
		controller: 'mainController'
	});
  $routeProvider.when('/about', {
    templateUrl: 'partials/about.html',
    controller: 'aboutController'
  });
  $routeProvider.otherwise({redirectTo: '/'});
}]);


Number.prototype.withCommas = function() {
  return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

String.prototype.withCommas = function() {
  return parseFloat(this).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



var toStrWithCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
