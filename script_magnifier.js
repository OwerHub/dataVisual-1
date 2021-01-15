function page_load (){





	
	

// set the dimensions and margins of the graph
var margin = {top: 100, right: 30, bottom: 30, left: 60},
    width = 1100 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var Svg = d3.select("#dataviz_brushZoom")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data.csv", function(data) {
 console.log(data[3].Petal_Length.trim())
  // Add X axis
  var x = d3.scaleLinear()
    .domain([60,76])
    .range([ 0, width ]);
  var xAxis = Svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([85, 170])
    .range([ height, 0]);
  Svg.append("g")
    .call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = Svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Add brushing
  var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  var mouseover_new = function (d) {
    d3.select(this).attr("r", 15);
    
  }
  
  var scatter = Svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Add circles
  scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class","circles")
    .attr("cx", function (d) { return x(d.Sepal_Length.trim()); } )
    .attr("cy", function (d) { return y(d.Petal_Length.trim()); } )
    .attr("r",4)
    //.style("fill", "red"  )
    .style("opacity", 0.4)
    
    // Add the brushing
    scatter.selectAll(".circles").on("mouseover", mouseover_new)
  
  
    scatter
    .append("g")
      .attr("class", "brush")
      .call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout
  function idled() { idleTimeout = null; }




  
  // A function that update the chart for given boundaries
  function updateChart() {

    extent = d3.event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain([ 60,76])
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    scatter
      .selectAll("circle")
      .transition().duration(1000)
      .attr("cx", function (d) { return x(d.Sepal_Length); } )
      .attr("cy", function (d) { return y(d.Petal_Length); } )

    }



})

        // wait while draw all circle
setTimeout(function(){
  
        // all circle in one variable
  let try3 = document.querySelectorAll(".circles") ;


      // dedicate colorize function 
  function colorize(color_offset_x, color_offset_y) {
    
    let color_of_circles = "";
      
    for (let index = 0; index < try3.length; index++) {
      
        //cy to y
      let nry = Math.round(try3[index].getAttribute("cy")) ;
      nry = nry*0.8-color_offset_y;
      if (nry < 1) { nry= 1} else if (nry > 255) {nry = 255};

        //cx to x
      let nrx = Math.round(try3[index].getAttribute("cx")) ;
      nrx = nrx*0.5-color_offset_x;
      if (nrx < 1) { nrx= 1} else if (nry >255 ) {nry = 255};
      
        //colorize
      color_of_circles = `rgb(${nrx},${nry},0)`
      try3[index].style.fill = color_of_circles;
      

    } //forend
  }
      // colorize első meghívása, alapértékekkel
  colorize(40,50);


      // mousemove, a mozgás mértékével eltolja az offsetet
  document.addEventListener('mousemove', e => {
    let h = window.innerHeight ;
    let w = window.innerWidth;
    x = e.offsetX;
    y = e.offsetY;
      
    // colorize függvény meghívása egérmozgás értékével
    colorize(40+(Math.round((x-w/2)/15)),50-(Math.round((h/2-y)/10)) )
  });


 }, 3000);



/// oldal: https://www.d3-graph-gallery.com/graph/interactivity_zoom.html

} //end

window.addEventListener("load", page_load)