'use strict';

/* Filters */

angular.module('myApp.filters', [])
.filter('sidebarFilter', function() {
  return function(merchants, sidebar) {

  	var selected = []

  	merchants.forEach(function(merchant) {

		  if (sidebar.categories[merchant.category].checked !== true) {
	      return false;
	    }

	    if (merchant.alexa >= parseInt(sidebar.alexa)) {
	      return false;
	    }


	    if (sidebar.search !== undefined || sidebar.search !== "") {
	    	var regex = new RegExp(sidebar.search, "i");

		    if (!merchant.name.match(regex)) {
		      return false;
		    }
	    }

	    selected.push(merchant)
  	})

  	// Sort!

  	return selected.slice(0, sidebar.limit)
  }
});
