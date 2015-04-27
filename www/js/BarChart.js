/**
 * Created by Alejandro on 31/03/2015.
 * objPeticion
 */

function CrearBarChart(data,objPeticion){
    //Width and height

    console.log(data.observation);
    console.log(data);
    console.log(objPeticion);
    //var dataset = [40,-100,100,25,36,74,-85,70,-9];
    var dataset = data.observation;
    for(var i = 0; i<dataset.length;i++){
        dataset[i] = parseInt(dataset[i]);
    }

    var margin = {top: 0, right: 0, bottom: 10, left: 0},
        w= 960 - margin.left - margin.right,
        h = 50 * dataset.length;

    //Create the SVG Viewport
    var svgContainer = d3.select("#GraficaBarras").append("svg")
        .attr("width", w*2)
        .attr("height", 100);

    //Create the Scale we will use for the Axis
    var axisScale = d3.scale.linear()
        .domain(d3.extent(dataset, function(d) { return d; }))
        .range([0, w]);

    //Create the Axis
    var xAxis = d3.svg.axis()
        .scale(axisScale);


    //Create an SVG group Element for the Axis elements and call the xAxis function
    var xAxisGroup = svgContainer.append("g")
        .call(xAxis);


    var x = d3.scale.linear()
        .domain(d3.extent(dataset, function(d) { return d; }))
        .range([0, w]);

    var y = d3.scale.ordinal()
        .domain(dataset.map(function(d) { return d; }))
        .rangeRoundBands([0, h], .01);

    var svg = d3.select("#GraficaBarras")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(Math.min(0, d)); })
        .attr("y", function(d, i) {
            return i * (h / dataset.length);
        })
        .attr("width", function(d) { return Math.abs(x(d) - x(0)); })
        .attr("height", y.rangeBand())
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d * 10) + ")";
        });


  /*  svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y2", h);*/



    //Create SVG element
    /* var svg = d3.select("#GraficaBarras")
     .append("svg")
     .attr("width", w)
     .attr("height", h);

     svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("y", function(d, i) {
     return i * (h / dataset.length);
     })
     .attr("x", function(d) {
     //console.log(w - (d / 4));
     return w - (d/4);
     })
     .attr("height", h / dataset.length - barPadding)
     .attr("width", function(d) {
     return d * 100;
     })
     .attr("fill", function(d) {
     return "rgb(0, 0, " + (d * 10) + ")";
     }); */

  /*  svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("text-anchor", "middle")
        .attr("y", function(d, i) {
            return i * (h / dataset.length) + (h / dataset.length - barPadding) / 2;
        })
        .attr("x", function(d) {
            return w - (d * 4) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white"); */
}