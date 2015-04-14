/**
 * Created by Alejandro on 31/03/2015.
 */

function CrearBarChart(data,objPeticion){
    //Width and height

    var w = 500;
    var h = 100;
    var barPadding = 1;

    console.log(data.observation);
    var dataset = data.observation;

    //Create SVG element
    var svg = d3.select("#Barras")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w / dataset.length);
        })
        .attr("y", function(d) {
            return h - (d / 4);
        })
        .attr("width", w / dataset.length - barPadding)
        .attr("height", function(d) {
            return d * 4;
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d * 10) + ")";
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
            return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
        })
        .attr("y", function(d) {
            return h - (d * 4) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");
}