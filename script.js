$(document).ready(function() {
  $.getJSON(
    "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
    function(json) {
      var returnNum = json.map(function(d, i) {
        return [
          [
            json[i].Place,
            json[i].Time,
            json[i].Name,
            json[i].Year,
            json[i].Doping
          ]
        ];
      });
      var dataset = [].concat.apply([], returnNum);

      var dataset2 = dataset.map(function(value) {

        var valueX
        var clean

          if(value[4].length==0){
            valueX="No Doping Allegation";
            clean=0;
          }
          else{
            valueX=value[4];
             clean=100;
          }

        return [
          value[0],
          parseFloat(value[1].substr(0, 2) + "." + value[1].substr(3, 4)) -
            parseFloat(
              dataset[0][1].substr(0, 2) + "." + dataset[0][1].substr(3, 4)
            ),
          value[2],
          value[3],
          valueX,
          clean
        ];
      });


      function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
      }

      var data = dataset2.map(function(value) {
        return [value[0], roundToTwo(value[1]), value[2], value[3], value[4], value[5]];
      });



      var margin = { top: 20, right: 100, bottom: 100, left: 100 },
        width = $(".divCard").width() - margin.left - margin.right,
        height = $(".divCard").height() - margin.top - margin.bottom;


          var colorScale =  d3.scaleThreshold()
                          .domain([0,1])
                          .range(["#000000","#000000","#ff0000"]);

      // set the ranges
      var x = d3.scaleLinear().range([width, 0]);
      var y = d3.scaleLinear().range([0, height]);

      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      var svg = d3
        .select(".divCard")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tooltip = d3
        .select(".divCard")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Scale the range of the data
      x.domain([
        0,
        d3.max(data, function(d) {
          return d[1];
        })+1
      ]);
      y.domain([
        0,
        d3.max(data, function(d) {
          return d[0];
        })+5
      ]);






      // Add the scatterplot
      svg.selectAll("dot")
         .append("g")
         .data(data)
          .enter()
          .append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
          return x(d[1]);
        })
        .attr("cy", function(d) {
          return y(d[0]);
        })
      .style("fill", function(d) { return colorScale(d[5]); })

        .on("mouseover", function(d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(d[4])
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      // Add the X Axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g").call(d3.axisLeft(y));

      svg

        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", -30)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "18px")
        .style("fill", "#ff3232 ")
        .attr("font-family", "sans-serif")
        .text("Ranking");
      svg
        .append("text")
        .attr("y", height + 20)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "1vw")
        .style("fill", "black")
        .attr("font-family", "sans-serif")
        .text("Minutes Behind Fastest Time");

       svg
        .append("text")
        .attr("y", -25)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "2.25vw")
        .style("fill", "black")
        .attr("font-family", "sans-serif")
        .text("Doping in Professional Bicycle Racing");

             svg
        .append("text")
        .attr("y", height+45)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("font-size", "13px")
        .style("fill", "black")
        .attr("font-family", "sans-serif")
        .text("35 Fastest times up Alpe d'Huez [Normalized to 13.8km distance]");



      var text = svg.append("g").selectAll("text").data(data).enter().append("text");


      //Add SVG Text Element Attributes
      var textLabels = text
        .attr("x", function(d) {
          return x(d[1])+10;
        })
        .attr("y", function(d) {
          return y(d[0])+3;
        })
        .text(function(d) {
          return   d[2] ;

        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "red");

       var legend = svg.selectAll(".legend")
      .data(colorScale.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width-100)
      .attr("y", height-100)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

  // draw legend text
  legend.append("text")
      .attr("x", width-75)
      .attr("y", height-90)
      .attr("dy", ".35em")
      .style("text-anchor", "left")
      .text(function(d) { if(d==0) return "No Allegation"; else return "Allegation";})

    }
  );
});
