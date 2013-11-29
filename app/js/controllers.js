'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('mainController', function($scope, Data) {

    $scope.categories = Data.query({
      type: "categories",
      isArray: true
    })

  	$scope.merchants = Data.query({
  		type: "merchants",
  		isArray: true
  	})

    $scope.sidebar = {
      limit: 10,
      alexa: 500000
    }
  })
  .controller('aboutController', function() {

  });
