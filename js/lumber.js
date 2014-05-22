/*
  LUMBER.js

  Crafted with <3 by John Otander(@4lpine).
  MIT License
 */

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

  lumber.data   = chartDiv.attr("data-lumber-values").split(",");
  lumber.width  = chartDiv.attr("data-lumber-width") || 500;
  lumber.height = chartDiv.attr("data-lumber-height") || 250;
  lumber.type   = chartDiv.attr("data-lumber-type") || "bar";
  lumber.yAxis  = chartDiv.attr("data-lumber-y-axis-label") || "Y Axis";
  lumber.xAxis  = chartDiv.attr("data-lumber-x-axis-label") || "X Axis";

  if (lumber.type == "bar")              { lumber.barChart(chartDiv);    }
  else if (lumber.type == "pie")         { lumber.pieChart(chartDiv);    }
  else if (lumber.type == "line")        { lumber.lineChart(chartDiv);   }
  else if (lumber.type == "histogram")   { lumber.histogram(chartDiv);   }
  else if (lumber.type == "scatterplot") { lumber.scatterplot(chartDiv); }
}

/*
  Bar Chart

    Create a lovely bar chart that is so beautiful no one will even care what
    the data even means.

    Params:
      chartDiv = string for selection, for example "#chart" or ".lumber-chart"

    Requirements:
      type     = Specified by the lumber-type data attribute

      data     = The data is expected to be a data attribute with the form:
                 'x1:y1,x2:y2,...,xn:yn'

      yAxis    = Utilizes the lumber-y-axis-label data attribute
      xAxis    = Utilizes the lumber-x-axis-label data attribute

      width    = Specified by the lumber-width data attribute
      height   = Specified by the lumber-height data attribute

 */
lumber.barChart = lumber_barChart;
function lumber_barChart(chartDiv) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width  = lumber.width - margin.left - margin.right,
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
      .call(xAxis)
    .append("text")
      .attr("y", 30)
      .attr("x", margin.left - 6)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text(lumber.xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(lumber.yAxis);

  chart.selectAll(".bar")
      .data(lumber.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d); })
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d); })
      .attr("width", x.rangeBand());
}

lumber.pieChart = lumber_pieChart;
function lumber_pieChart(chartDiv) {
  // ...
}

lumber.lineChart = lumber_lineChart;
function lumber_lineChart(chartDiv) {
  // ...
}

lumber.histogram = lumber_histogram;
function lumber_histogram(chartDiv) {
  // ...
}

lumber.scatterplot = lumber_scatterplot;
function lumber_scatterplot(chartDiv) {
  // ...
}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

if (!hasLumberDependencies()) {
  console.log("Missing dependencies for lumber.js.");
}
