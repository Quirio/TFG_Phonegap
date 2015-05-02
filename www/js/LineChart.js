/**
 * Created by Alejandro on 02/05/2015.
 */
function CrearLineChart(/*data,objPeticion*/){
    //GraficaLinea
    //alert("ENTRO");


    var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
        { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
        { "x": 80,  "y": 5},  { "x": 100, "y": 60}];

    var margin = {top: 20, right: 0, bottom: 20, left: 0},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //This is the accessor function we talked about above
    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("linear");

    var formatNumber = d3.format(".1f");

    var y = d3.scale.linear()
        .domain([0, 1e6])
        .range([height, 0]);

    var axisxScale = d3.scale.linear()
        .domain(d3.extent(lineData, function(d) { return d.x; }))
        .range([0, width]);

    var axisyScale = d3.scale.linear()
        .domain([0, d3.max(lineData, function(d) { return d.y })])
        .range([height, 0]);


    var xAxis = d3.svg.axis()
        .scale(axisxScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(axisyScale)
        .tickSize(width)
       // .tickFormat(formatCurrency)
        .orient("right");

    var svg = d3.select("#GraficaLineas").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var lineGraph = svg.append("path")
        .attr("d", lineFunction(lineData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    var gy = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .call(customAxis);

    var gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    setTimeout(function() {
        y.domain([0, 3e6]);

        gy.transition()
            .duration(2500)
            .call(yAxis)
            .selectAll("text") // cancel transition on customized attributes
            .tween("attr.x", null)
            .tween("attr.dy", null);

        gy.call(customAxis);
    }, 1000);

    function customAxis(g) {
        g.selectAll("text")
            .attr("x", 4)
            .attr("dy", -4);
    }

   /* function formatCurrency(d) {
        var s = formatNumber(d / 1e6);
        return d === y.domain()[1]
            ? "$" + s + " million"
            : s;
    }*/


/*
    var lineData = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                     { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                     { "x": 80,  "y": 5},  { "x": 100, "y": 60}];


    d3.select("#GraficaLineas").append("svg")
        .attr("class", "axis")
        .attr("width", 1440)
        .attr("height", 30)
        .append("g")
        .attr("transform", "translate(0,30)")
        .call(axis);

    */

}