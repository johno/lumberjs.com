/*
  LUMBER.js

    Crafted with <3 by John Otander(@4lpine).
    MIT Licensed
 */

/*
  hasLumberDependencies

    Check to ensure that d3 is present, additionally check to see if a few
    other javascript dependencies are also there because Lumber.js relies
    upon them.

    Returns:
      true or false
 */
function hasLumberDependencies() {
  return "d3" in window &&
         "addEventListener" in window &&
         "querySelector" in document &&
         Array.prototype.forEach
}

var lumber = {}

/*
  getGraphs

    Select all the DOM elements with the class '.lumber'.

    Returns:
      Array of all DOM elements with the class '.lumber'.
 */
lumber.getGraphs = lumber_getGraphs;
function lumber_getGraphs() {
  return document.querySelectorAll(".lumber");
}

/*
  parseChartData

    Params:
      dataAsString = The data is expected to be a data attribute with the form:
                     'x1:y1,x2:y2,...,xn:yn'

    Returns:
      [{x1:y1},...{xn,yn}]
 */
lumber.parseChartData = lumber_parseChartData;
function lumber_parseChartData(dataAsString) {
  dataPoints = dataAsString.split(",");
  return dataPoints.map(function(dataPoint) {
    data = {};
    data.y  = dataPoint.split(':')[1];
    data.x = dataPoint.split(':')[0]
    return data;
  });
}

/*
  graph

    TODO: Also allow an options hash to be passed in.

    Utilize the d3.select method to grab the chart selection that's passed in. All of the
    lumber options are taken from the chartDiv's data attributes.

    Params:
      chartDiv = A dom selection based on a class or id: '#lumber' or '.my-lumber-chart'.
 */
lumber.graph = lumber_graph;
function lumber_graph(chartDiv) {
  chartDiv = d3.select(chartDiv);

  lumberOpts = {}
  lumberOpts.data   = lumber.parseChartData(chartDiv.attr("data-lumber-values"));
  lumberOpts.width  = chartDiv.attr("data-lumber-width") || 500;
  lumberOpts.height = chartDiv.attr("data-lumber-height") || 250;
  lumberOpts.type   = chartDiv.attr("data-lumber-type") || "bar";
  lumberOpts.yAxis  = chartDiv.attr("data-lumber-y-axis-label") || "";
  lumberOpts.xAxis  = chartDiv.attr("data-lumber-x-axis-label") || "";

  if (lumberOpts.type == "bar")              { lumber.barChart(chartDiv, lumberOpts);    }
  else if (lumberOpts.type == "pie")         { lumber.pieChart(chartDiv, lumberOpts);    }
  else if (lumberOpts.type == "line")        { lumber.lineChart(chartDiv, lumberOpts);   }
  else if (lumberOpts.type == "histogram")   { lumber.histogram(chartDiv, lumberOpts);   }
  else if (lumberOpts.type == "scatterplot") { lumber.scatterplot(chartDiv, lumberOpts); }
}

/*
  barChart

    Create a lovely bar chart that is so beautiful no one will even care what
    the data even means.

    This will use the lumberOpts parameter to create a bar chart within the
    chartDiv. The chartDiv is assumed to be an svg DOM element.

    Params:
      chartDiv   = string for selection, for example "#chart" or ".lumber-chart"
      lumberOpts = options hash of information for creating the chart.

    Requirements (as keys in lumberOpts):
      type   = Specified by the lumber-type data attribute

      data   = The data is expected to be pre-parsed by parseChartData.

      yAxis  = Utilizes the lumber-y-axis-label data attribute
      xAxis  = Utilizes the lumber-x-axis-label data attribute

      width  = Specified by the lumber-width data attribute
      height = Specified by the lumber-height data attribute

  http://bl.ocks.org/mbostock/3885304
 */
lumber.barChart = lumber_barChart;
function lumber_barChart(chartDiv, lumberOpts) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width  = lumberOpts.width - margin.left - margin.right,
      height = lumberOpts.height - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left").ticks(3, "");

  x.domain(lumberOpts.data.map(function(d) { return d.y; }))
  y.domain([0, d3.max(lumberOpts.data, function(d) { return d.x; })])

  var chart = chartDiv
      .attr("width", lumberOpts.width)
      .attr("height", lumberOpts.height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("y", 30)
      .attr("x", margin.left - 6)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text(lumberOpts.xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(lumberOpts.yAxis);

  chart.selectAll(".bar")
      .data(lumberOpts.data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.y); })
      .attr("y", function(d) { return y(d.x); })
      .attr("height", function(d) { return height - y(d.x); })
      .attr("width", x.rangeBand());
}

lumber.pieChart = lumber_pieChart;
function lumber_pieChart(chartDiv, lumberOpts) {
  // ...
}

/*
  lineChart



  http://bl.ocks.org/mbostock/3883245
 */
lumber.lineChart = lumber_lineChart;
function lumber_lineChart(chartDiv, lumberOpts) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width  = lumberOpts.width - margin.left - margin.right,
      height = lumberOpts.height - margin.top - margin.bottom;


  var parseDate = d3.time.format("%d-%b-%y");
  lumberOpts.data.forEach(function(dataPoint) {
    dataPoint.x = parseDate.parse(dataPoint.x);
    dataPoint.y = +dataPoint.y;
  });

  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

  var svg = chartDiv
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(lumberOpts.data, function(d) { return d.x; }));
    y.domain(d3.extent(lumberOpts.data, function(d) { return d.y; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append("path")
        .datum(lumberOpts.data)
        .attr("class", "line")
        .attr("d", line);
}

lumber.histogram = lumber_histogram;
function lumber_histogram(chartDiv, lumberOpts) {
  // ...
}

lumber.scatterplot = lumber_scatterplot;
function lumber_scatterplot(chartDiv, lumberOpts) {
  // ...
}

if (!hasLumberDependencies()) {
  console.log("Missing dependencies for lumber.js.");
}
