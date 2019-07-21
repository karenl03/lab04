'use strict';
//INSTRUCTIONS
//1. convert experience_yr, hw1_hrs, age into numerical values parseFloat()
//age corresponds to size of circles on scatter
//2. create scatterplot that shows relation btwn number of hrs and pervious experience


// IIFE
(function () {

    // Init data
    let data = [];

    // Fetch json data
    d3.json('/load_data', (d) => {

        return d;

    }).then((d) => {

        // Redefine data
        data = d['users'];

        createVis();
    }).catch((err) => {

        console.error(err);
    });

    /*
     Function :: createVis()
     */
    function createVis() {
        //get data
        var data2 = [];
        for (var i=0; i<data.length; i++) {
            data2.push([parseFloat(data[i].experience_yr), parseFloat(data[i].hw1_hrs), parseFloat(data[i].age), 1]);   
        }
        //SVG 
        var svg = d3.select("#scatter"), 
            width = svg.attr("width"),
            height = svg.attr("height");
        
        //setup
        var margin = {top: 20, right: 0, bottom: 20, left: 60},
            plot_dx = svg.attr("width") - margin.right - margin.left,
            plot_dy = svg.attr("height") - margin.top - margin.bottom;

        //scales
        var x = d3.scaleLinear().range([margin.left, plot_dx]),
            y = d3.scaleLinear().range([plot_dy, margin.top]);
        var xscale = d3.scaleLinear()
            .range([margin.left, plot_dx])
            .domain([0, 10]);
        var yscale = d3.scaleLinear()
            .range([plot_dy, margin.top])
            .domain([0, 15]);
        var ageScale = d3.scaleLinear()
            .domain([0, 50])
            .range([1, 6]);
        
        //axes and titles
        var axis_x = d3.axisBottom(x)
                .tickSize(5)
                .scale(xscale)
                .tickFormat(d3.format("1")),
            axis_y = d3.axisLeft(y)
                .scale(yscale)
                .tickFormat(d3.format("1"));
        svg.append("g")
            .attr("id", "axis_x")
            .attr("transform", "translate(0," + (plot_dy + margin.bottom / 2) + ")")
            .call(axis_x
                .ticks(10));
        svg.append("g")
           .attr("id", "axis_y")
           .attr("transform", "translate(" + (margin.left / 1.5) + ", 0)")
           .call(axis_y
                .ticks(15));
        svg.append("text")  
            .attr("x", width/2 )
            .attr("y", height-5 )
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .text("Years of Programming Experience");
        svg.append("text")      
            .attr("transform", "translate("+ (15) +","+(height/2-10)+")rotate(-90)")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .text("Hours Spent on HW1");

        //build scatter
        var circles = svg.append("g") 
            .selectAll("circle")
            .data(data2)
            .enter()
            .append("circle")
            .style("fill", "#9b0a0a")
            .attr("r", function(d, i) {
                return ageScale(data2[i][2]);
            })
            .attr("cx", function(d, i) {
                return xscale(data2[i][0]);
            })
            .attr("cy", function(d, i) {
                return yscale(data2[i][1]);
            });
}

})();