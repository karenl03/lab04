'use strict';
//INSTRUCTIONS
//1. use d3.nest to aggregate the data
//2. define ordinal scale to map data keys to different color values
//3. donut chart arcs need to be interactive by hover - show number of students

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
        //d3.nest to aggregate data
        const nestData = d3.nest()
            .key(function(d) { return d.prog_lang; })
            .rollup(function(lang) { return lang.length; })
            .entries(data);
        console.log(nestData);
        
        //define ordinal scale to map data keys to colors
        var colorScale = d3.scaleOrdinal()
            .domain(["java", "py", "cpp", "js", "php", "other"])
            .range(["#1b7688", "#166161", "#f9d057", "#f29e2e", "#9b0a0a", "#d7191c"]);
        
        //SVG
        var svg = d3.select("#donutChart"), 
            width = svg.attr("width"),
            height = svg.attr("height"),
            radius = Math.min(width, height) / 2.5,
            g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        //create arc
        var arc = d3.arc()
                .innerRadius(75)
                .outerRadius(radius);

        //create arc hover
        var arcHover = d3.arc()
                .innerRadius(60)
                .outerRadius(radius);

        //create pie chart
        var pie = d3.pie()
            .value(function(d) {
                return d.value;
            });
        
        //build pie chart
        const paths = g.selectAll("path")
            .data(pie(nestData))
            .enter()
            .append("g")
                .on('mouseover', function (d) {
                    var txG = d3.select(this)
                        .append("g")
                        .style("fill", colorScale(this.i));
                    var tx1 = txG.append("text")
                        .text(`${d.value}`)
                        .attr("text-anchor", "middle")
                        .attr("dy", "20px")
                        .attr("id", "tx1")
                        .style("font-size", "30px");
                    var tx2 = txG.append("text")
                        .text(`${nestData[this.i].key}`)
                        .attr("text-anchor", "middle")
                        .attr("id", "tx2")
                        .attr("dy", "-10px")
                        .style("font-size", "20px");
                })
                .on('mouseout', function(d) {
                    d3.select("#tx1").remove();
                    d3.select("#tx2").remove();
                })
                .each(function (d, i) {
                    this.i = i;
                })
            .append("path")
            .attr("d", arc)
            .style("fill", function(d, i) {
                return colorScale(i);
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("d", arcHover)
                    .style("opacity", 0.4);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("d", arc)
                    .style("opacity", 1);
                    //.style("fill", colorScale(this.i));
            })
            .each(function (d, i) {
                this.i = i;
            });

    }


})();