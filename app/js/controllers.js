'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('mainController', function($scope, Data) {

  	$scope.merchants = Data.get({
  		type: "merchants"
  	})

    $scope.sidebar = {
      limit: 300,
      alexa: 1000000,
      categories: Data.get({
        type: "categories"
      })
    }
  })
  .controller('aboutController', function() {

  });
