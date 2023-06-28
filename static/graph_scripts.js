//Define containerwidth, margin, width and height of the graph, legend width and height, radius of the datapoints on the graph
    var containerwidth,
        containerHeight,
        margin = { //margin values for desktop
            top: 70,
            right: 40,
            bottom: 70,
            left: 50
        },
        width,
        height = 400 - margin.top - margin.bottom,
        legendWidth,
        legendHeight = 300,
        radius = 4;

    //all the three data lines are active at first
    var vietnamPathActive = true,
        thailandPathActive = true,
        indiaPathActive = true;

    //Define the color for the lines and text color

    var vietnamColor = "#FED47D",
        indiaColor = "#FABE9C",
        thailandColor = "#F6AB9A",
        textColor = "#333333";

    //Number format for the y-axis and the tooltips

    var numberFormat = ",.2r";
    var numberFormat2 = ",";

    //Global variables x, y
    var x, y;

    //Data is loaded after reading the csv into dataArr.

    var dataArr;

    //indicated that the data loaded
    var loadedData = false,
        isMobile = false; //indicator of mobile viewport


    //transition type 

    var transitionType = d3.easeSin;

    /***
    Start of csv data reading function
    **/
    var dataArr = d3.csv("static/milledRiceEndingStocks.csv", function(error, data) {
        // Format the data & make it easier to call the values later
        //Date Format for the year value
        var parseDate = d3.timeParse("%Y");

        //Format the numbers. 
        data.forEach(function(d) {
            d.year = parseDate(d[data.columns[0]]);
            d.Vietnam = +d.Vietnam;
            d.India = +d.India;
            d.Thailand = +d.Thailand
        });

        //Make the series data for easier processing when graphing the y axis.
        series = data.columns.slice(1, 4).map(function(key) {
            return data.map(function(d) {
                return {
                    key: key,
                    year: d.year,
                    value: +d[key]
                };
            });
        });

        dataArr[0] = data;
        dataArr[1] = series;
        loadedData = true;


        //call it to make mobile responsive and draw the graph;
        resize();

    });
    /***
    End of csv data reading function
    **/


    /***
    Start of drawGraph function
    **inputs 
    var data - data array from csv (Array)
    var series- data array for easier processing (used in the calculation of y range) (Array)
    var isMobile - indicator for mobile viewport (boolean)
    **/
    function drawGraph(data, series, isMobile) {

        //Start of defining desktop viewport  
        if (!isMobile) {

            //Container including both line graph and legend
            var GraphContainer = d3.select(".container").append("svg")
                .attr("width", containerwidth)
                .attr("height", containerHeight);

            //svg -> g for line chart, className "lineChart"
            var svg = GraphContainer.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "lineChart")
                .append("g")
                .attr("transform",
                    "translate(" + 0 + "," + margin.top + ")");

            //svg -> g for Legend box className "legendGroup" 
            var legend = GraphContainer.append("svg")
                .attr("class", "legendGroup")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .attr("x", width)
                .attr("y", margin.top)
                .append("g")
                .attr("transform",
                    "translate(" + 20 + "," + 10 + ")");


            //Add the title for legend into legend box
            legend.append("text")
                .attr("class", "legendTitle")
                .append("svg:tspan")
                .attr('x', 0)
                .attr('dy', 5)
                .text("Click to")
                .append("svg:tspan")
                .attr('x', 0)
                .attr('dy', 15)
                .text("hide/show");

            //Legend for Vietnam id "vietNamGroup"
            var vietNamGroup = legend.append("svg")
                .attr("x", 0)
                .attr("y", 110)
                .attr("class", "vietNamGroup")
                .attr("width", legendWidth)
                .on("click", function() {
                    //Determine if current line is visible
                    var active = vietnamPathActive;
                    var textOpacity = active ? 0.5 : 1;
                    d3.selectAll(".vietNamGroup").style("opacity", textOpacity);
                    //d3.select("#vietNamPath").active =active?false:true;
                    vietnamPathActive = active ? false : true;
                    //Repopulate the graph
                    svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);

                })
                .append("a")
                .attr("href", "#0")
                .append("g");

            //Append the short line with the color
            vietNamGroup
                .append("line")
                .attr("stroke", vietnamColor)
                .attr("stroke-width", "5px")
                .attr("width", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("x2", 10)
                .attr("y2", 0);

            //Append the text for the country name class "legend"
            vietNamGroup
                .append("text")
                .attr("class", "legend")
                .attr("x", 15)
                .attr("dy", 10)
                .style("fill", textColor)
                .text("Vietnam");

            //Legend for India id "indiaGroup"
            var indiaGroup = legend.append("svg")
                .attr("x", 0)
                .attr("y", 50)
                .attr("class", "indiaGroup")
                .attr("width", legendWidth)
                .on("click", function() {

                    //Determine if current line is visible
                    var active = indiaPathActive;
                    var textOpacity = active ? 0.5 : 1;
                    //hide or show the elements
                    d3.selectAll(".indiaGroup").style("opacity", textOpacity);
                    indiaPathActive = active ? false : true;
                    //Repopulate the graph
                    svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);
                })
                .append("a")
                .attr("href", "#0")
                .append("g");

            //Append the line with the color 
            indiaGroup
                .append("line")
                .attr("stroke", indiaColor)
                .attr("stroke-width", "5px")
                .attr("width", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("x2", 10)
                .attr("y2", 0);


            //Append the country name text
            indiaGroup
                .append("text")
                .attr("class", "legend")
                .attr("x", 15)
                .attr("dy", 10)
                .style("fill", textColor)
                .text("India");


            //Legend for Thailand id "thailandGroup"
            var thailandGroup = legend.append("svg")
                .attr("x", 0)
                .attr("y", 80)
                .attr("class", "thailandGroup")
                .attr("width", legendWidth)
                .on("click", function() {

                    //Determine if current line is visible
                    var active = thailandPathActive;
                    var textOpacity = active ? 0.5 : 1;
                    //hide or show the elements
                    d3.selectAll(".thailandGroup").style("opacity", textOpacity);
                    thailandPathActive = active ? false : true;
                    //Repopulate the graph
                    svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);
                })
                .append("a")
                .attr("href", "#0")
                .append("g");


            //Append the line with the color
            thailandGroup
                .append("line")
                .attr("stroke", thailandColor)
                .attr("stroke-width", "5px")
                .attr("width", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("x2", 10)
                .attr("y2", 0);


            //Append the text country name
            thailandGroup
                .append("text")
                .attr("class", "legend")
                .attr("x", 15)
                .attr("dy", 10)
                .style("fill", textColor)
                .text("Thailand");


        }
        //End of defining desktop viewport
        else {
            //Start of defining mobile viewport
            //Add GraphContainer for legend and lineChart
            var GraphContainer = d3.select(".container").append("svg")
                .attr("width", containerwidth)
                .attr("height", containerHeight);

            //LineChart (svg->g) className "lineChart"
            var svg = GraphContainer.append("svg")
                .attr("width", width + 60)
                .attr("height", height + margin.bottom + margin.top + legendHeight)
                .attr("class", "lineChart")
                .attr("y", 50)
                .append("g")
                .attr("transform",
                    "translate(" + 0 + "," + (legendHeight + margin.top) + ")");


            //Legend box is different for mobile view (100% of container width)
            var legend = GraphContainer.append("svg")
                .attr("class", "legendGroup")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .attr("x", 0)
                .attr("y", margin.top)
                .append("g")
                .attr("transform",
                    "translate(" + 0 + "," + 10 + ")");

            //Add the title for legend
            legend.append("text")
                .attr("class", "legendTitle")
                .append("svg:tspan")
                .attr('x', 0)
                .attr('dy', 5)
                .text("Click to hide/show");


            //Legend for Vietnam 
            var vietNamGroup = legend.append("svg")
                .attr("x", 200)
                .attr("y", 20)
                .attr("class", "vietNamGroup")
                .attr("width", legendWidth)
                .on("click", function() {
                    //Determine if current line is visible
                    var active = vietnamPathActive;
                    var textOpacity = active ? 0.5 : 1;
                    d3.selectAll(".vietNamGroup").style("opacity", textOpacity);
                    //d3.select("#vietNamPath").active =active?false:true;
                    vietnamPathActive = active ? false : true;
                    //Repopulate the graph
                    svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);

                })
                .append("a")
                .attr("href", "#0")
                .append("g");

            vietNamGroup
                .append("line")
                .attr("stroke", vietnamColor)
                .attr("stroke-width", "5px")
                .attr("width", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("x2", 10)
                .attr("y2", 0);

            vietNamGroup
                .append("text")
                .attr("class", "legend")
                .attr("x", 15)
                .attr("dy", 10)
                .style("fill", textColor)
                .text("Vietnam");


            //Legend for India
            var indiaGroup = legend.append("svg")
                .attr("x", 0)
                .attr("y", 20)
                .attr("class", "indiaGroup")
                .attr("width", legendWidth)
                .on("click", function() {
                    //Determine if current line is visible
                    var active = indiaPathActive;
                    var textOpacity = active ? 0.5 : 1;
                    //hide or show the elements
                    d3.selectAll(".indiaGroup").style("opacity", textOpacity);
                    indiaPathActive = active ? false : true;
                    //Repopulate the graph
                    svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);
                })
                .append("a")
                .attr("href", "#0")
                .append("g");

            indiaGroup
                .append("line")
                .attr("stroke", indiaColor)
                .attr("stroke-width", "5px")
                .attr("width", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("x2", 10)
                .attr("y2", 0);

            indiaGroup
                .append("text")
                .attr("class", "legend")
                .attr("x", 15)
                .attr("dy", 10)
                .style("fill", textColor)
                .text("India");


            //Legend for Thailand
            var thailandGroup = legend.append("svg")
                .attr("x", 100)
                .attr("y", 20)
                .attr("class", "thailandGroup")
                .attr("width", legendWidth)
                .on("click", function() {
                    //Determine if current line is visible
                    var active = thailandPathActive;
                    var textOpacity = active ? 0.5 : 1;
                    //hide or show the elements
                    d3.selectAll(".thailandGroup").style("opacity", textOpacity);
                    thailandPathActive = active ? false : true;
                    //Repopulate the graph
                    svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);
                })
                .append("a")
                .attr("href", "#0")
                .append("g");

            thailandGroup
                .append("line")
                .attr("stroke", thailandColor)
                .attr("stroke-width", "5px")
                .attr("width", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("x2", 10)
                .attr("y2", 0);

            thailandGroup
                .append("text")
                .attr("class", "legend")
                .attr("x", 15)
                .attr("dy", 10)
                .style("fill", textColor)
                .text("Thailand");
        }
        //End of defining mobile viewport




        //yAxisTitle
        var yAxisTitle = GraphContainer.append("text")
            .attr("class", "yAxisTitle")
            .text("Thousand metric tonnes")
            .attr("dy", margin.top - 30);

        if (isMobile) {
            //If it's mobile view port, it's a bit lower. 
            yAxisTitle.attr("dy", "30");
        }


        //Draw the axis x,y and the paths
        svg = populateAxis(data, series, vietnamPathActive, indiaPathActive, thailandPathActive, svg, isMobile);


    }

    /***
    Start of function populateAxis
    **inputs **
    data (Array) - data read from csv
    series (Array) - processed data with different format of array
    hasVietNam (boolean) - indicator whether to show the path for Vietnam
    hasIndia (boolean) - indicator whether to show the path for India
    hasThailand (boolean) - indicator whether to show the path for Thailand
    svg (svg object) - SVG -> G container to draw the axis and paths in
    **Remarks**
    Use the global variables (x,y,)
    **/
    function populateAxis(data, series, hasVietNam, hasIndia, hasThailand, svg, isMobile) {
    	/**Start of Animating text opacity and sequence of legend text**/
        var vTextOpacity = hasVietNam ? 1 : 0.5;
        //hide or show the elements
        d3.selectAll(".vietNamGroup").style("opacity", vTextOpacity);

        var iTextOpacity = hasIndia ? 1 : 0.5;
        //hide or show the elements
        var vLx = 200,
            iLx = 0,
            tLx = 100;
        var vLy = 110,
            iLy = 50,
            tLy = 80;

        d3.selectAll(".indiaGroup").style("opacity", iTextOpacity);

        if (isMobile) {
            if (!hasIndia) {
                if (hasThailand && hasVietNam) {
                    iLx = 200;
                    tLx = 0;
                    vLx = 100;
                }
                if (!hasVietNam) {
                    tLx = 0;
                    iLx = 100;
                }
                if (!hasThailand) {
                    vLx = 0;
                    tLx = 200;
                    iLx = 100;
                }
                if (!hasVietNam && !hasThailand) {
                    vLx = 200;
                    tLx = 100;
                    iLx = 0;
                }
            }
            if (!hasThailand) {
                if (hasIndia && hasVietNam) {
                    vLx = 100;
                    tLx = 200;
                }
            }
            d3.selectAll(".thailandGroup").transition()
                .ease(transitionType)
                .duration(1000).attr("x", tLx);
            d3.selectAll(".indiaGroup").transition()
                .ease(transitionType)
                .duration(1000).attr("x", iLx);
            d3.selectAll(".vietNamGroup").transition()
                .ease(transitionType)
                .duration(1000).attr("x", vLx);
        } else {
            if (!hasIndia) {
                if (hasThailand && hasVietNam) {
                    iLy = 110;
                    tLy = 50;
                    vLy = 80;
                }
                if (hasThailand && !hasVietNam) {
                    tLy = 50;
                    iLy = 80;
                }

                if (!hasThailand) {
                    vLy = 50;
                    tLy = 110;
                    iLy = 80;
                }
                if (!hasVietNam && !hasThailand) {
                    vLy = 110;
                    tLy = 80;
                    iLy = 50;
                }
            }
            if (!hasThailand) {
                if (hasIndia && hasVietNam) {
                    vLy = 80;
                    tLy = 110;
                }
            }
            d3.selectAll(".thailandGroup").transition()
                .ease(transitionType)
                .duration(1000).attr("y", tLy);
            d3.selectAll(".indiaGroup").transition()
                .ease(transitionType)
                .duration(1000).attr("y", iLy);
            d3.selectAll(".vietNamGroup").transition()
                .ease(transitionType)
                .duration(1000).attr("y", vLy);

        }



        var tTextOpacity = hasThailand ? 1 : 0.5;
        //hide or show the elements
        d3.selectAll(".thailandGroup").style("opacity", tTextOpacity);
        /**End of Animating text opacity and sequence of legend text**/


        //Scale the range of the data for x and y
        x.domain(d3.extent(data, function(d) {
            return d.year;
        }));

        var xTicks = 5, //default size for x-axis is five; 
            yTicks = 5, //default size for both mobile and web is still five
            translateX = 0,
            yTickSize = width + 5; //default translate for x-axis and the paths is 0 


        if (isMobile) {
        	//change the x - tick values to 2, shift the graph to right by 50 pixel
            xTicks = 2,
                yTicks = 5,
                translateX = 50,
                yTickSize = width + translateX + 5;

        }


        //Define X Axis
        var xAxis = d3.axisBottom().scale(x)
            .ticks(xTicks)
            .tickFormat(function(d) {
                formatDate = d3.timeFormat("%Y")
                return this.parentNode === this.parentNode.parentNode.firstChild.nextSibling ? "\xa0" : formatDate(d);
            });
        if (d3.select(".x_axis")) {
            d3.select(".x_axis").remove();
        }

        //Apppend xAxis with the transition
        var xAxisGroup = svg.append('g')
            .attr("class", "x_axis")
            .attr("transform", "translate(" + translateX + "," + (height + 30) + ")")
            .transition()
            .ease(transitionType)
            .duration(1000)
            .attr("transform", "translate(" + translateX + "," + height + ")")
            .call(xAxis);

        //Define Y Axis
        var yAxis = d3.axisRight(y)
            .ticks(yTicks)
            .tickSize(yTickSize)
            .tickFormat(function(d) {
                if (d != 0) {
                    var s = d3.format(numberFormat)(d);
                } else {
                    var s = 0;
                }
                return "\xa0" + s;
            });



        //Country array to check against with key value in series data if a country is present; 
        var countries = [];
        if (hasVietNam) {
            countries.push("Vietnam");
        }
        if (hasThailand) {
            countries.push("Thailand");
        }
        if (hasIndia) {
            countries.push("India");
        }

        //Calculate maxY value;
        var maxY = d3.max(series, function(s) {
            return d3.max(s, function(d) {
                if (countries.indexOf(d.key) != -1) {

                    return d.value;
                }
            });
        });

        //largest y axis boundry value
        var boundry = 0;

        do {
            boundry += 5000;
        } while (boundry < maxY);

        y.domain([0, boundry]);

        //Append custom Y Axis
        if (svg.select(".y_axis")) {
            svg.select(".y_axis").remove();
        }
        var yGroup = svg.append("g")
            .attr("class", "y_axis")
            .call(customYAxis);

        //Function for customYAxis;
        function customYAxis(g) {

            var s = g.selection ? g.selection() : g;
            g.call(yAxis);
            //s.select(".tick").remove();

            s.selectAll(".tick line").filter(Number).attr("stroke", "#333333")
                .attr("y2", 30)
                .attr("y1", 30)
                .transition()
                .ease(transitionType)
                .duration(1000)
                .attr("y2", 0)
                .attr("y1", 0);
            s.selectAll(".tick text").attr("x", 4).attr("dy", -4)
                .attr("dy", 26)
                .transition()
                .ease(transitionType)
                .duration(1000)
                .attr("dy", -4);
            if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
        }




        //append the paths to the svg
        //Remove the existing paths if the graph is redrawn on resize

        if (svg.select("#vietNamPath")) {
            svg.select("#vietNamPath").remove();
        }
        if (svg.select("#thailandPath")) {
            svg.select("#thailandPath").remove();
        }

        if (svg.select("#indiaPath")) {
            svg.select("#indiaPath").remove();
        }


        if (hasVietNam) {
            //Define the valueline for vietnam
            var valueLine1 = d3.line()
                .x(function(d) {
                    return x(d.year);
                })
                .y(function(d) {
                    return y(d.Vietnam);
                });

            //append the path to the graph
            svg.append("path")
                .attr("class", "line") //define class name to use for styling
                .attr("stroke", vietnamColor)
                .attr("id", "vietNamPath")
                .attr("transform", "translate(" + translateX + "," + 60 + ")")
                .transition()
                .ease(transitionType)
                .duration(1000)
                .attr("transform", "translate(" + translateX + "," + "0)")
                .attr("d", valueLine1(data));


        }

        if (hasIndia) {

            //Define value line for india
            var valueLine2 = d3.line()
                .x(function(d) {
                    return x(d.year);
                })
                .y(function(d) {
                    return y(d.India);
                });
            //path for india data
            svg.append("path")
                .attr("class", "line") //define class name to use for styling
                .attr("stroke", indiaColor)
                .attr("id", "indiaPath")
                .attr("transform", "translate(" + translateX + "," + 60 + ")")
                .transition()
                .ease(transitionType)
                .duration(1000)
                .attr("transform", "translate(" + translateX + "," + "0)")
                .attr("d", valueLine2(data));
        }


        if (hasThailand) {
            //Define value line for thailand
            var valueLine3 = d3.line()
                .x(function(d) {
                    return x(d.year);
                })
                .y(function(d) {
                    return y(d.Thailand);
                });

            //path for thailand data
            svg.append("path")
                .attr("class", "line") //define class name to use for styling
                .attr("stroke", thailandColor)
                .attr("id", "thailandPath")
                .attr("transform", "translate(0" + translateX + "," + 60 + ")")
                .transition()
                .ease(transitionType)
                .duration(1000)
                .attr("transform", "translate(" + translateX + "," + "0)")
                .attr("d", valueLine3(data));
        }
        //Remove the previous data points and lines
        svg.selectAll("circle").remove();
        svg.selectAll(".legendLine").remove();
        d3.selectAll(".legendText").remove();
        d3.select(".tooltipMobile").remove();

        //On click shows the values of datapoints

        d3.select(".lineChart").on("click", function() {

            var coords = d3.mouse(this);
            a = coords[0]; //x pixel point
            b = coords[1]; //y pixel point

            if (isMobile) {
                //Mobile view has x pixel point 50 more to the right
                a = a - translateX;
            }

            var xValue = x.invert(a); //calculate the xValue back (scaleTime value)
            formatDate = d3.timeFormat("%Y"); //date format
            xValue = formatDate(xValue); //year value for xValue eg. Sat Jan 01 2011 00:00:00 GMT+0800 (Malay Peninsula Standard Time)

            //search for Vietnam value
            series[0].forEach(function(z) {
                if (formatDate(z.year) == xValue) { //if(year value is the same as the xValue)
                    vietNamVal = z.value; //VietnamVal = z.value;
                    xLabel = z.year; //xLabel value will be z.year; "2009"
                }
            });
            //search for India value
            series[1].forEach(function(z) {
                if (formatDate(z.year) == xValue) {
                    indiaVal = z.value;
                }
            });

            //search for Thailand value
            series[2].forEach(function(z) {
                if (formatDate(z.year) == xValue) {
                    thailandVal = z.value;
                    xLabel = z.year;
                }
            });


            //Remove the legend line if there is existing one
            svg.selectAll(".legendLine").remove();
            var xLinePos = x(xLabel);
            if (isMobile) {
                xLinePos = xLinePos + translateX;
            }

            //Append the legend line
            svg.append("line")
                .attr("x1", xLinePos)
                .attr("y1", 0)
                .attr("x2", xLinePos)
                .attr("y2", height)
                .attr("stroke", "#333")
                .attr("opacity", 0.3)
                .attr("class", "legendLine")
                .attr("stroke-width", "2");

            d3.select(".legendYear").remove();
            d3.selectAll(".legendText").remove();
            d3.select(".tooltipMobile").remove();



            if (!isMobile) { //if it's for desktop 
                //Select the legend group
                legendGroup = d3.select(".legendGroup g");
                //Append the year
                legendGroup.append("text")
                    .attr("class", "legendYear")
                    .text(xValue)
                    .attr('x', 0)
                    .attr('dy', 40);

                //Apend the vietnam value
                d3.selectAll(".vietNamGroup")
                    .append("text")
                    .attr("class", "legendText")
                    .attr("x", 0)
                    .attr("dy", 25)
                    .style("fill", textColor)
                    .text(d3.format(numberFormat2)(vietNamVal));

                //Append the india value
                d3.selectAll(".indiaGroup")
                    .append("text")
                    .attr("class", "legendText")
                    .attr("x", 0)
                    .attr("dy", 25)
                    .style("fill", textColor)
                    .text(d3.format(numberFormat2)(indiaVal));

                //Append the thailand value
                d3.selectAll(".thailandGroup")
                    .append("text")
                    .attr("class", "legendText")
                    .attr("x", 0)
                    .attr("dy", 25)
                    .style("fill", textColor)
                    .text(d3.format(numberFormat2)(thailandVal));
                //End of desktop def
            } else {
                //Start of mobile def
                //Add a block for tooltip on the graph
                var toolTipMobile =
                    svg.append("g")
                    .attr("class", "tooltipMobile")
                    .attr("transform",
                        "translate(" + 0 + "," + margin.top + ")");


                //Calculate xPos of the tooltip on the graph
                var xPos = x(xLabel) + 10;
                xPos = xPos + 150 > width ? 40 : xPos;

                //Rect while color background

                toolTipMobile.append("rect")
                    .attr("width", 150)
                    .attr("height", 120)
                    .attr("fill", "#FFF")
                    .attr("stroke", textColor)
                    .attr("stroke-width", 0.5)
                    .attr("x", xPos)
                    .attr("y", 5);

                //group for the text lines
                var tooltipG = toolTipMobile.append("svg")
                    .append("g")
                    .attr("width", 150)
                    .attr("height", 120)
                    .attr("transform", "translate(" + (xPos + 10) + "," + 10 + ")");


                //year value text	
                tooltipG.append("text")
                    .attr("class", "legendText")
                    .text(xValue)
                    .attr("fill", textColor)
                    .attr("x", 0)
                    .attr("y", 25);

                var vY = 85,
                    iY = 45,
                    tY = 65,
                    xA = 0;

                //Vietnam line color, country name and value 
                tooltipG
                    .append("line")
                    .attr("stroke", vietnamColor)
                    .attr("stroke-width", "5px")
                    .attr("width", 10)
                    .attr("x1", xA)
                    .attr("y1", vY)
                    .attr("x2", xA + 10)
                    .attr("y2", vY);

                tooltipG
                    .append("text")
                    .attr("class", "legend")
                    .attr("x", xA + 15)
                    .attr("dy", vY + 10)
                    .style("fill", textColor)
                    .text("Vietnam");

                tooltipG.append("text")
                    .attr("class", "legendText")
                    .text(vietNamVal)
                    .attr("fill", textColor)
                    .attr("x", xA + 95)
                    .attr("y", vY + 10);

                //India line color, country name and value 
                tooltipG
                    .append("line")
                    .attr("stroke", indiaColor)
                    .attr("stroke-width", "5px")
                    .attr("width", 10)
                    .attr("x1", xA)
                    .attr("y1", iY)
                    .attr("x2", xA + 10)
                    .attr("y2", iY);

                tooltipG
                    .append("text")
                    .attr("class", "legend")
                    .attr("x", xA + 15)
                    .attr("dy", iY + 10)
                    .style("fill", textColor)
                    .text("India");

                tooltipG.append("text")
                    .attr("class", "legendText")
                    .text(indiaVal)
                    .attr("fill", textColor)
                    .attr("x", xA + 95)
                    .attr("y", iY + 10);

                //Thailand line color, country name and value 
                tooltipG
                    .append("line")
                    .attr("stroke", thailandColor)
                    .attr("stroke-width", "5px")
                    .attr("width", 10)
                    .attr("x1", xA)
                    .attr("y1", tY)
                    .attr("x2", xA + 10)
                    .attr("y2", tY);

                tooltipG
                    .append("text")
                    .attr("class", "legend")
                    .attr("x", xA + 15)
                    .attr("dy", tY + 10)
                    .style("fill", textColor)
                    .text("Thailand");

                tooltipG.append("text")
                    .attr("class", "legendText")
                    .text(thailandVal)
                    .attr("fill", textColor)
                    .attr("x", xA + 95)
                    .attr("y", tY + 10);
                //End of mobile def
            }
            //prepare the data for data points
            var dataset = [];

            if (hasVietNam) {

                newData = {
                    x: xLabel, // Takes the pixel number to convert to number
                    y: vietNamVal,
                    color: vietnamColor
                };

                dataset.push(newData); // Push data to our array

            }
            if (hasIndia) {
                newData = {
                    x: xLabel, // Takes the pixel number to convert to number
                    y: indiaVal,
                    color: indiaColor
                };
                dataset.push(newData);
            }
            if (hasThailand) {


                newData = {
                    x: xLabel, // Takes the pixel number to convert to number
                    y: thailandVal,
                    color: thailandColor
                };

                dataset.push(newData);
            }
            //Update the data points
            svg.selectAll("circle").remove();


            svg.selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("r", radius)
                .attr("cx", function(d) {
                    return x(d.x) + translateX;
                })
                .attr("cy", function(d) {
                    return y(d.y);
                })
                .attr("fill", function(d) {
                    return d.color;
                })
                .attr("stroke", "#FFF");


        });

        return svg;

    }

    /***
    End of function populateAxis
    **/


    /***
	Start of resize function
    **/
    function resize() {
        // Call the resize function whenever a resize event occurs
        //or at the start of loading contents into dom;
        if (loadedData) {

            //If it's resize event, remove the graph drawn earlier
            d3.select(".container svg").remove();
            containerwidth = d3.select(".container").node().getBoundingClientRect().width;

            if (containerwidth <= 450) {

                //if the container width is less than 450, make it mobile view;

                //update width, height, legendWidth and legendHeight
                //update the indicator for mobile view port
                width = containerwidth - 60;
                //Redefine the container height
                containerHeight = height + legendHeight + (margin.top + margin.bottom + margin.top);
                legendWidth = containerwidth;
                legendHeight = 40;
                height = 400 - legendHeight - margin.top - margin.bottom;
                isMobile = true;
            } else {
                isMobile = false;
                //update the container with and legend width, width and legend width for desktop
                containerHeight = 450,
                    width = (containerwidth * 0.87) - margin.right - margin.left,
                    legendWidth = Math.round((containerwidth * 0.17));
                height = 400 - margin.top - margin.bottom,
                    legendHeight = 300;
            }
            //Redefine x, y with updated width and height
            x = d3.scaleTime().range([0, width]);
            y = d3.scaleLinear().range([height, 0]);
            //if data is not empty, draw the graph
            if (dataArr) {
                drawGraph(dataArr[0], dataArr[1], isMobile);
            }
        }
    }

    /***
	End of resize function
    **/



    // Call the resize function when there is window resize event
    d3.select(window).on('resize', resize);