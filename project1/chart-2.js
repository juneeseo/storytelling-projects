(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 480 - margin.top - margin.bottom,
    width = 960 - margin.left - margin.right;

  var svg = d3.select("#chart-2")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xPositionScale = d3.scalePoint()
    .domain(['Downtown', 'Midtown', 'Upper West Side', 'Upper East Side', 'North Brooklyn', 'Northwest Brooklyn', 'East Brooklyn', 'South Brooklyn'])
    .range([50,width-50])

  var radius = 100;
  //var radiusScale = d3.scaleLinear().domain([d3.min(d.low),d3.max(d.high)]).range([50,radius])
  var radiusScale = d3.scaleLinear().domain([35000,88000000]).range([10,radius])

  // There must be better way to do this.......
  var angleScale = d3.scalePoint()
    .domain(['1/1/10', '2/1/10', '3/1/10', '4/1/10', '5/1/10', '6/1/10', '7/1/10', '8/1/10', '9/1/10', '10/1/10', '11/1/10', '12/1/10', '1/1/11', '2/1/11', '3/1/11', '4/1/11', '5/1/11', '6/1/11', '7/1/11', '8/1/11', '9/1/11', '10/1/11', '11/1/11', '12/1/11', '1/1/12', '2/1/12', '3/1/12', '4/1/12', '5/1/12', '6/1/12', '7/1/12', '8/1/12', '9/1/12', '10/1/12', '11/1/12', '12/1/12', '1/1/13', '2/1/13', '3/1/13', '4/1/13', '5/1/13', '6/1/13', '7/1/13', '8/1/13', '9/1/13', '10/1/13', '11/1/13', '12/1/13', '1/1/14', '2/1/14', '3/1/14', '4/1/14', '5/1/14', '6/1/14', '7/1/14', '8/1/14', '9/1/14', '10/1/14', '11/1/14', '12/1/14', '1/1/15', '2/1/15', '3/1/15', '4/1/15', '5/1/15', '6/1/15', '7/1/15', '8/1/15', '9/1/15', '10/1/15', '11/1/15', '12/1/15', 'blah'])
    .range([0, 2*Math.PI])

  var radialArea = d3.radialArea()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .outerRadius(function(d) {
      return radiusScale(d.high)
    })
    .innerRadius(function(d) {
      return radiusScale(d.low)
    })
    .curve(d3.curveCatmullRomClosed);

  d3.queue()
    .defer(d3.csv, "submarkets.csv")
    .await(ready)

  function ready(error, datapoints) {
    var nested = d3.nest()
      .key(function(d) {
        return d.market
      })
      .entries(datapoints);
      console.log(nested)

    var charts = svg.selectAll(".radial-charts")
      .data(nested)
      .enter().append("g")
      .attr("transform", function(d) {
        var yPos = height/2
        var xPos = xPositionScale(d.key);
        return "translate(" + xPos + "," + yPos + ")"
      })

      charts.each(function(d) {
        var monthlyData = d.values;
        var g = d3.select(this);

        var gradient = svg.append("svg:defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "80%")
            .attr("y2", "80%")
            .attr("spreadMethod", "pad");

        // Define the gradient colors
        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", "#EE3A39")
            .attr("stop-opacity", 0.5);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#75C7EF")
            .attr("stop-opacity", 0.5);

        // opacity doesn't work............
        g.selectAll("path")
          .data(monthlyData)
          .enter().append("path")
          .attr("d", radialArea(monthlyData))
          .attr("opacity", 0.2)
          .attr("stroke", "none")
          .attr("fill", "url(#gradient)");
      })

      charts.append("text")
        .attr("x", 0)
        .attr("y", -70)
        .attr("font-size", 9)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "#000000")
        .text(function(d) {
          return d.key
        })

      charts.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0.5)
        .attr("fill", "#000000")

      charts.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", radiusScale([5000000]))
      .attr("stroke", "#000000")
      .attr("stroke-width", 0.25)
      .attr("fill", "none")

  }
})();
