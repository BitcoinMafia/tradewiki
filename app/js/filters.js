'use strict';

/* Filters */

angular.module('myApp.filters', [])
.filter('sidebarFilters', function() {
  return function(resourceObject, sidebar) {

  	var selected = []

  	var names = Object.keys(resourceObject)
  	console.log(names)
  	// for (var i=0; i<names.length; i++) {
  	// 	var merchant = resourceObject[names[i]];


  	// 	// console.log(merchant)

	  //   if (sidebar.categories[merchant.category].checked !== true) {
	  //     return false;
	  //   }

	  //   var regex = new RegExp(sidebar.search, "i");
	  //   if (name.match(regex)) {
	  //     return false;
	  //   }

	  //   if (merchant.alexa >= sidebar.alexa) {
	  //     return false;
	  //   }

	  //   selected.push(merchant)
  	// }

  	// Sort!

  	return resourceObject.slice(0, sidebar.limit)
  }
});
