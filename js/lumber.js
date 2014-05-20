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
  lumber.type   = chartDiv.attr("data-type") || "bar";

  if (lumber.type == "bar") {
    lumber.barChart(chartDiv);
  }
}

lumber.barChart = lumber_barChart;
function lumber_barChart(chartDiv) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = lumber.width - margin.left - margin.right,
      height = lumber.height - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(2, "%");

  x.domain(lumber.data.map(function(d) { return d; }))
  y.domain([0, d3.max(lumber.data, function(d) { return d; })])

  var chart = chartDiv
      .attr("width", lumber.width)
      .attr("height", lumber.height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  chart.selectAll(".bar")
      .data(lumber.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d); })
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d); })
      .attr("width", x.rangeBand());
}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

if (!hasLumberDependencies()) {
  console.log("Missing dependencies for lumber.js.");
}
