// Bubble Class
var BubbleChart = function(data, sidebar) {
  var self = this

  var max_amount;
  self.selector = "#vis"; //hard code
  self.sidebar = sidebar;
  self.width = 940;
  self.height = 600;

  // Category
  // Temp hack; get $resource working ...
  self.categoryList = [
      "Getting started",
      "Currency exchanges",
      "Financial",
      "Bitcoin eWallets",
      "Bitcoin payment systems",
      "Internet & Mobile services",
      "Online products",
      "Material / Physical Products",
      "Professional services",
      "Commerce and community",
      "Travel / Tourism / Leisure"
    ]
  self.categoryColors = [
    "#1e2a36",
    "#13987e",
    "#2383c4",
    "#7f9293",
    "#df2e1b",
    "#d2850b",
    "#e64540",
    "#29527a",
    "#cc6600",
    "#e7d70b",
    "#858585"
  ]

  self.data = data

  self.tooltip = CustomTooltip("bubble-tooltip", 240);

  self.center = {
    x: self.width / 2,
    y: self.height / 2
  };

  self.layout_gravity = -0.01;
  self.damper = 0.1;
  self.vis = null;
  self.nodes = [];
  self.nodesOriginal = []
  self.force = null;
  self.circles = null;
  self.fill_color = d3.scale
    .ordinal()
    .domain(self.categoryList)
    .range(self.categoryColors);

  max_amount = 1000000 // hard code, should be max alexa?

  self.default_radius = 15;

  self.radius_scale = d3.scale
    .pow()
    .exponent(0.5)
    .domain([0, max_amount])
    .range([2, 30]);

  // Methods
  self.create_nodes();
  self.create_vis();
}

// Core Methods
BubbleChart.prototype.create_nodes = function() {
  var self = this;

  self.data.forEach(function(merchant) {

    var node = {
      id: merchant.alexa,
      radius: self.radius_scale(self.inverseAlexa(merchant.alexa)),
      alexa: merchant.alexa,
      name: merchant.name,
      url: merchant.url,
      description: merchant.description,
      category: merchant.category,
      subcategory: merchant.subcategory,
      x: Math.random() * 900,
      y: Math.random() * 800
    };

    self.nodes.push(node);

    var nodeClone = $.extend(true, {}, node);
    self.nodesOriginal.push(nodeClone);
  })

  // self.nodes.sort(function(a, b) {
  //   b.alexa - a.alexa;
  // });
};

BubbleChart.prototype.create_vis = function() {
  var self = this;

  self.vis = d3.select(self.selector)
    .append("svg")
    .attr("width", self.width)
    .attr("height", self.height)
    .attr("id", "svg_vis");

  self.circles = self.vis
    .selectAll("circle")
    .data(self.nodes, function(d) {
      return d.id;
    }
  );

  self.circles
    .enter()
    .append("circle")
    .attr("r", 0)
    .attr("fill", function(d) {
      return self.fill_color(d.category);
    })
    .attr("stroke-width", 2)
    .attr("stroke", function(d) {
      return d3.rgb(self.fill_color(d.category)).darker();
    })
    .attr("id", function(d) {
      return "bubble_" + d.id;
    })
    .on("mouseover", function(d, i) {
      return self.show_details(d, i, this);
    })
    .on("mouseout", function(d, i) {
      return self.hide_details(d, i, this);
    })
    .on("click", function(d, i) {
      window.open(d.url, "_blank")
    })

  self.circles
    .transition()
    .duration(500)
    .attr("r", function(d) {
      return d.radius;
    });

};

BubbleChart.prototype.charge = function(d) {
  return -Math.pow(d.radius, 2.0) / 8;
};

BubbleChart.prototype.start = function() {
  var self = this;
  return self.force = d3.layout
    .force()
    .nodes(self.nodes)
    .size([self.width, self.height]);
};

BubbleChart.prototype.inverseAlexa = function(num) {
  var value = (1.0/num) * 10000000000
  if (value >= 5000000) {
    return 5000000
  } else {
    return value
  }
}






// Filter Methods
BubbleChart.prototype.filter_by = function(sidebar) {
  var self = this;

  self.nodes.forEach(function(node, i) {

    // If any of these nodes are filtered out, short circuit and return
    if (i >= sidebar.limit) {
      node.radius = 0
      return
    }

    if (sidebar.categories[node.category].checked !== true) {
      node.radius = 0
      return
    }

    var regex = new RegExp(sidebar.search, "i");
    if (!node.name.match(regex)) {
      node.radius = 0
      return
    }

    if (node.alexa >= sidebar.alexa) {
      node.radius = 0
      return
    }

    // // Otherwise, return the original
    node.radius = self.nodesOriginal[i].radius

  });

  self.filter();
};

BubbleChart.prototype.filter = function() {
  var self = this

  self.force.start();

  self.circles
    .transition()
    .duration(500)
    .attr("r", function(d) {
      return d.radius;
    });
};


BubbleChart.prototype.display_all = function() {
  var self = this;

  self.force
    .gravity(self.layout_gravity)
    .charge(self.charge)
    .friction(0.9)
    .on("tick", function(e) {
      return self.circles.each(self.move_towards_center(e.alpha))
        .attr("cx", function(d) {
          return d.x;
        })
        .attr("cy", function(d) {
          return d.y;
        });
      }
    );

  self.force.start();
};

BubbleChart.prototype.move_towards_center = function(alpha) {
  var self = this;
  return function(d) {
    d.x = d.x + (self.center.x - d.x) * (self.damper + 0.02) * alpha;
    return d.y = d.y + (self.center.y - d.y) * (self.damper + 0.02) * alpha;
  };
};

// Tooltip

BubbleChart.prototype.show_details = function(data, i, element) {
  var self = this;

  var content;
  d3.select(element).attr("stroke", "black");

  content = "<div><strong>Name:</strong><span> " + data.name + "</div>";
  content += "<div><strong>Alexa:</strong><span> " + data.alexa.withCommas() + "</div>";
  content += "<div><strong>Category:</strong><span> " + data.category + "</div>";
  content += "<div><strong>Sub-Category:</strong><span> " + data.subcategory + "</div>";
  content += "<div><strong>Description:</strong><span> " + data.description + "</div>";

  return self.tooltip.showTooltip(content, d3.event);
};

BubbleChart.prototype.hide_details = function(data, i, element) {
  var self = this;
  d3.select(element)
    .attr("stroke", function(d) {
      return d3.rgb(self.fill_color(d.category)).darker();
    }
  );

  return self.tooltip.hideTooltip();
};
