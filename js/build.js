var w = 800;
var h = 800;

// Colors
var seaNeonGreen = d3.color("#66c010");
var seaLightGreen = d3.color("#D1EDBD");
var seaMapGreen = d3.color("#B3E090");
var seaNavy = d3.color("#002145");

/*
// Define projection
var projection = d3.geoMercator()
                   .center([-122.3, 47.60])
                   .translate([w/2, h/2])
                   .scale([100000]);

// Define path from projection
var path = d3.geoPath()
             .projection(projection);

d3.json("data/neighborhoods.geojson", function(json) {

  // Bind data and create a path per geojson feature
  svg.selectAll("path")
     .data(json.features)
     .enter()
     .append("path")
     .attr("d", path);

}); // end d3.json
*/

// Create leaflet map
var seaMap = L.map('map-container').setView([47.60, -122.3], 13);
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(seaMap);

// Add an SVG element to Leaflet’s overlay pane
var svg = d3.select(seaMap.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

d3.json("data/data.json", function(geoShape) {

	//  create a d3.geo.path to convert GeoJSON to SVG
	var projection = d3.geo.transform({ point: projectPoint });
  var path = d3.geo.path().projection(projection);

	// create path elements for each of the features
	d3_features = g.selectAll("path")
                	.data(geoShape.features)
                	.enter()
                  .append("path");

	map.on("viewreset", reset);

	reset();

	// fit the SVG element to leaflet's map layer
	function reset() {

		bounds = path.bounds(geoShape);

		var topLeft = bounds[0],
			bottomRight = bounds[1];

		svg .attr("width", bottomRight[0] - topLeft[0])
			.attr("height", bottomRight[1] - topLeft[1])
			.style("left", topLeft[0] + "px")
			.style("top", topLeft[1] + "px");

		g .attr("transform", "translate(" + -topLeft[0] + ","
		                                  + -topLeft[1] + ")");

		// initialize the path data
		d3_features.attr("d", path)
			.style("fill-opacity", 0.7)
			.attr('fill','blue');
	}

	// Use Leaflet to implement a D3 geometric transformation.
	function projectPoint(x, y) {
		var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
	}

})
