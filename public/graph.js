var globalSettings = {
    mainId: "content"
 }

function getXYModifiers(specificPoint, points) {

    var xMultiplier = 1, yMultiplier = 1;
    xMultiplier = 1.03;
    yMultiplier = 1.02;

    if (specificPoint.x == 0)
        xMultiplier = 1.44;

    //Ensure points have enough distance between eachother. We need lots of horizontal space to draw labels!
    var arr = points.slice(0, points.indexOf(specificPoint));
    for(i = points.indexOf(specificPoint)-1; i == 0; i--) {
        var p = arr[i];
        if (p.y === specificPoint.y && Math.abs(p.x - specificPoint.x) < 10) {
            yMultiplier = 1.05;
        }
    }

    return { x: xMultiplier, y: yMultiplier };
}


function getHighestRank(data, name) {
    var highestRank = 0;
    var fighter = data[findFighterIndexByName(data, name)];

    fighter.forEach((snapshot) => {
        if (highestRank < snapshot.y)
            highestRank = snapshot.y;
    });
    console.log(name, "rank", highestRank)
    return highestRank;
}

function findFighterIndexByName(fighters, name) {
    var fighterIndex = 0;
    fighters.forEach(function (fighter, fighterIx) {
        var snapshot = fighter[0];
        if (snapshot.name == name)
            fighterIndex = fighterIx;
    });
    return fighterIndex;
}

function drawLegend(data, divisionContainerId) {
    
    var divisionTitle = data.title; 
    var colors = getColors(data.length, 10);
    //************************************************************
    // Append Legend to page
    //************************************************************
    
    var divisionLegendContainer = document.createElement("DIV");
        divisionLegendContainer.className = "weightclass";
        divisionLegendContainer.id = divisionContainerId;
        
    var fightersContainer = document.createElement("DIV");
        fightersContainer.className = "legend";

    var divisionHeader = document.createElement("H1");
        divisionHeader.className = "division__header";
        divisionHeader.appendChild(document.createTextNode(data.title));
        divisionLegendContainer.appendChild(divisionHeader);

    data.forEach((fighter, ix) => {
        var name = fighter[0]["name"];

        var fighterElement = document.createElement("SPAN");
        fighterElement.className = "legend__item";
        fighterElement.style.cssText = 'padding-right: 20px; background-color:' + colors[ix] + ';';

        fighterElement.appendChild(document.createTextNode(name));
        fightersContainer.appendChild(fighterElement);
    });

    divisionLegendContainer.appendChild(fightersContainer);
    document.getElementById(globalSettings.mainId).appendChild(divisionLegendContainer);
}

function drawGraph(data, divisionContainerId) {
    var divisionTitle = data.title; 
    var colors = getColors(data.length, 10);
    //************************************************************
    // Create Margins and Axis and hook our zoom function
    //************************************************************
    var margin = { top: 20, right: 10, bottom: 30, left: 20 },
        width = window.innerWidth - margin.left - margin.right - 200,
        height = 700 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0, 40])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([-1, 16])
        .range([height, 0]);

    //Replace the X axis values from ints ( 0,1,2....) to display-friendly strings (like "Jan 2015")
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height)
        .tickPadding(10)
        .tickSubdivide(true)
        .tickFormat(function(d) { 
            return window.displayDates[d]; 
        })
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickPadding(10)
        .tickSize(-width)
        .tickSubdivide(true)
        .orient("left");

    // var zoom = d3.behavior.zoom()
    //     .x(x)
    //     .y(y);
    //.scaleExtent([1, 10]);
    //.on("zoom", zoomed);

    //************************************************************
    // Generate our SVG object
    //************************************************************	
    var svg = d3.select("#"+divisionContainerId).append("svg") //output svg to the DOM
        //.call(zoom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", (-margin.left) + 20)
        .attr("x", -height / 2)
        .text(divisionTitle);

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    //************************************************************
    // Create D3 line object and draw data on our SVG object
    //************************************************************
    var line = d3.svg.line()
        .interpolate("basis")	 //linear
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); });

    svg.selectAll('.line')
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr('stroke', function (d, i) {
            return colors[i % colors.length];
        })
        .attr("d", line);

    //************************************************************
    // Draw dots where a fighter line changes
    //************************************************************
    var points = svg.selectAll('.dots')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "dots")
        .attr("clip-path", "url(#clip)");

    var drawnPoints = [];
    var dots = points.selectAll('.dot')
        .data(function (d, index) {
            var a = [];
            var prevPoint = null;
            d.forEach(function (point, i) {
                if (i == 0 || prevPoint !== null && point.y !== prevPoint.y) {
                    a.push({ 'index': index, 'point': point });
                }
                prevPoint = point;
            });
            return a;
        })
        .enter().append('g').attr('class', 'circle');

    dots.append('circle')
        .attr('class', 'dot')
        .attr("r", 0, 0)
        .attr('fill', function (d, i) {
            return colors[d.index % colors.length];
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
        });

    //************************************************************
    // Draw labels with fighter-names associated to dots
    //************************************************************

    var namesDrawnAsLabels = [];
    var pointsDrawnAsLabels = [];
    var dotLabels = dots.append("text")
        .attr('class', 'fighter-name')
        .text(function (d) {
            if (namesDrawnAsLabels.indexOf(d.point.name) < 0 && getHighestRank(data, d.point.name) == d.point.y) {
                namesDrawnAsLabels.push(d.point.name);
                pointsDrawnAsLabels.push(d.point);
                return d.point.name;
            }
            return;
        })
        .attr("text-anchor", "right")
        .attr("transform", function (d) {
            var xyMultipliers = getXYModifiers(d.point, pointsDrawnAsLabels);
            var xvalue = d.point.x * xyMultipliers.x;
            var yvalue = d.point.y * xyMultipliers.y;
            return "translate(" + x(xvalue) + "," + y(yvalue) + ")";
        })
        .attr('fill', function (d, i) {
            return colors[d.index % colors.length];
        });

    // console.log(divisionContainerId);
    // console.log(namesDrawnAsLabels);
}
