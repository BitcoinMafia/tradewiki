'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('mainController', function($scope, Data) {

  	$scope.merchants = Data.get({
  		type: "merchants"
  	})

    $scope.sidebar = {
      limit: 10,
      alexa: 500000,
      categories: Data.get({
        type: "categories"
      })
    }
  })
  .controller('aboutController', function() {

  });
