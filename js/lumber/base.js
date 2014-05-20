function hasLumberDependencies() {
  return "d3" in window &&
         "addEventListener" in window &&
         "querySelector" in document &&
         Array.prototype.forEach
}

var lumber = {}

lumber.getGraphs = lumber_getGraphs;
function lumber_getGraphs() {
  return document.querySelectorAll(".lumber");
}

lumber.graph = lumber_graph;
function lumber_graph(chartDiv) {
  chartDiv = d3.select(chartDiv);

  lumber.data   = chartDiv.attr("data-values").split(",");
  lumber.width  = chartDiv.attr("data-width") || 500;
  lumber.height = chartDiv.attr("data-height") || 250;

  lumber.barChart(chartDiv);
}

lumber.barChart = lumber_barChart;
function lumber_barChart(chartDiv) {
  chartDiv.attr("width", lumber.width);
  chartDiv.attr("height", lumber.height);

  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = lumber.width - margin.left - margin.right,
      height = lumber.height - margin.top - margin.bottom;



  var y = d3.scale.linear()
    .range([lumber.height, 0]);

  // This utilizes parseInt() in order to coerce numeric ordering rather than
  // d3's natural order default. This will likely need to be handled more elegantly.
  y.domain([0, d3.max(lumber.data, function(d) { return parseInt(d); })]);

  var barWidth = lumber.width / lumber.data.length;

  var bar = chartDiv.selectAll("g")
      .data(lumber.data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return lumber.height - y(d); })
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d) + 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d; });
}

if (!hasLumberDependencies()) {
  console.log("Missing dependencies for lumber.js.");
}
