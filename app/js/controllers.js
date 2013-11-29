'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('mainController', function($scope, Data) {

  	$scope.merchants = Data.query({
  		type: "merchants",
  	})

    $scope.sidebar = {
      limit: 300,
      alexa: 1000000,
      categories: Data.get({
        type: "categories"
      })
    }

    // debugger
  })
  .controller('aboutController', function() {

  });
