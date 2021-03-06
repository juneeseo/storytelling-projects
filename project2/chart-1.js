(function() {
    var margin = { top: 30, left: 30, right: 30, bottom: 30},
    height = 800 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select("#graphic")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var radius = 500;

  var radiusScale = d3.scaleLinear().domain([40000,12400000]).range([50,radius])

  var angleScale = d3.scalePoint()
    .domain(['1/1/10', '2/1/10', '3/1/10', '4/1/10', '5/1/10', '6/1/10', '7/1/10', '8/1/10', '9/1/10', '10/1/10', '11/1/10', '12/1/10', '1/1/11', '2/1/11', '3/1/11', '4/1/11', '5/1/11', '6/1/11', '7/1/11', '8/1/11', '9/1/11', '10/1/11', '11/1/11', '12/1/11', '1/1/12', '2/1/12', '3/1/12', '4/1/12', '5/1/12', '6/1/12', '7/1/12', '8/1/12', '9/1/12', '10/1/12', '11/1/12', '12/1/12', '1/1/13', '2/1/13', '3/1/13', '4/1/13', '5/1/13', '6/1/13', '7/1/13', '8/1/13', '9/1/13', '10/1/13', '11/1/13', '12/1/13', '1/1/14', '2/1/14', '3/1/14', '4/1/14', '5/1/14', '6/1/14', '7/1/14', '8/1/14', '9/1/14', '10/1/14', '11/1/14', '12/1/14', '1/1/15', '2/1/15', '3/1/15', '4/1/15', '5/1/15', '6/1/15', '7/1/15', '8/1/15', '9/1/15', '10/1/15', '11/1/15', '12/1/15', 'blah'])
    .range([0, 2*Math.PI])
  var angleScale2 = d3.scalePoint()
    .domain(['1/1/10', '1/1/11', '1/1/12', '1/1/13', '1/1/14', '1/1/15', 'blah'])
    .range([0,2*Math.PI])

  var radialLineHigh = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .radius(function(d) {
      return radiusScale(d.high)
    })
    .curve(d3.curveCatmullRomClosed)

  var radialLineLow = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .radius(function(d) {
      return radiusScale(d.low)
    })
    .curve(d3.curveCatmullRomClosed)

  var radialLineAsking = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .radius(function(d) {
      return radiusScale(d.asking)
    })

  var radialLineSales = d3.radialLine()
    .angle(function(d) {
      return angleScale(d.month)
    })
    .radius(function(d) {
      return radiusScale(d.sales)
    })

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
    .defer(d3.csv, "brooklyn.csv")
    .await(ready)

  function ready(error, datapoints) {
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Define the gradient
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
        .attr("stop-opacity", 1);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#75C7EF")
        .attr("stop-opacity", 1);

    g.append("path")
      .datum(datapoints)
      .attr("d", radialLineLow)
      .attr("class", "path-low")
      .attr("stroke", "#75C7EF")
      .attr("stroke-width", 0.5)
      .attr("fill", "none")
      .attr("opacity", 0.7)
      //.transition()
      //.duration(2000)
      //.attr("d", radialArea)
      //.attr("stroke", "none")
      //.attr('fill', 'url(#gradient)')
      //.attr("opacity", 0.5);

    g.selectAll(".dollar-circle")
      .data([50000, 2500000, 5000000])
      .enter().append("circle")
      .attr("class", "dollar-circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) {
        return radiusScale(d)
      })
      .attr("fill", "none")
      .attr("stroke", "#000000")
      //.attr("stroke", "#EE3A39")
      .attr("stroke-width", 0.3)

    g.selectAll(".dollar-text")
      .data([50000, 2500000, 5000000])
      .enter().append("text")
      .attr("class", "dollar-text")
      .attr("x", 0)
      .attr("y", function(d) {
        return -(radiusScale(d)) - 5
      })
      .attr("font-size", 7)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "#000000")
      //.style("fill", "#EE3A39")
      .text(function(d) {
        return 'USD ' + d
      })

      // how do I make them to start at radiusScale('2500000')?
    g.selectAll(".month-line")
      .data(datapoints)
      .enter().append("line")
      .attr("class", "month-line")
      .attr("x0", 0)
      .attr("y0", 0)
      .attr("x1", function(d) {
        var a = angleScale2(d.month);
        return radiusScale('5000000') * Math.sin(a);
      })
      .attr("y1", function(d) {
        var a = angleScale2(d.month);
        return radiusScale('5000000') * Math.cos(a) * -1;
      })
      .attr("stroke", "#000000")
      //.attr("stroke", "#EE3A39")
      .attr("stroke-width", 0.1)


    // how do I rotate texts to align them with month lines
    g.selectAll(".months")
      .data(datapoints)
      .enter().append("text")
      .attr("class", "months")
      .attr("x", function(d) {
        var a = angleScale(d.month);
        return (radius/2 + 10) * Math.sin(a);
      })
      .attr("y", function(d) {
        var a = angleScale(d.month);
        return (radius/2 + 10) * Math.cos(a) * -1;
      })
      .attr("font-size", 5)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .style("fill", "#000000")
      //.style("fill", "#EE3A39")
      .text(function(d) {
        return d.month;
      })

      d3.select("#slide-1").on('slidein', function() {
        g.selectAll(".path-low")
        .attr("d", radialLineLow)
        .attr("stroke", "#75C7EF")
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 0.7)
        //.transition()
        //.duration(2000)
        //.attr("d", radialArea)
        //.attr("stroke", "none")
        //.attr('fill', 'url(#gradient)')
        //.attr("opacity", 0.5);

      })
      d3.select("#slide-1").on('slideout', function() {
        g.selectAll(".path-low")
        .attr("d", radialLineLow)
        .attr("stroke", "#75C7EF")
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 0.7)
      })
      d3.select("#slide-2").on('slidein', function() {

        g.selectAll(".path-low")
        .datum(datapoints)
        .transition()
        .duration(2000)
        .attr("d", radialLineHigh)
        .attr("class", "path-high")
        .attr("stroke", "#EE3A39")
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("opacity", 0.5)

        g.selectAll(".path-low")
        .attr("opacity", 0.7)
      })
      d3.select("#slide-2").on('slideout', function() {
        return
      })
      d3.select("#slide-3").on('slidein', function() {
        return
      })
      d3.select("#slide-3").on('slideout', function() {
        return
      })
      d3.select("#slide-4").on('slidein', function() {
        return
      })
      d3.select("#slide-4").on('slideout', function() {
        return
      })






  }

})();
