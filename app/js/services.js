'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory("Data", function($resource) {
	return $resource("/data/:type.json", {}, {
		get: {
			method: "GET",
			isArray: false
		}
	})
})
