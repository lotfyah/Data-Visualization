// code for creating Basic Map (Level 1)

// Creating initial map object
var myMap = L.map("map", {
    center: [17.6, -8.082],
    zoom: 5
  });
  
  // Create dark map layer (the background map image)
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 13,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
  }).addTo(myMap);

  // Store API link
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// Define a function to run once for each feature in the features array
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.sig),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set color from significance
    function getColor(significance) {
    switch (true) {
    case significance > 1000:
      return "#ea2c2c";
    case significance > 750:
      return "#ea822c";
    case significance > 500:
      return "#ee9c00";
    case significance > 250:
      return "#eecc00";
    case significance > 0:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }
  // set radius from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude ;
  }
    // GeoJSON layer
    L.geoJson(data, {
      // create cricle marker
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      
      style: styleInfo,
      // create popups for extra info about earthquake
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + "Earthquake: " + feature.properties.place + "</h3><hr><p>" + "Time: " + Date(feature.properties.time) + "</p>"
                      + "<pr>" + "Magnitude: " + feature.properties.mag + "</p>" + "<pr>" + "Significance: " + feature.properties.sig + "</p>");
      }
    }).addTo(myMap);
  
    // create the legend
    var legend = L.control({
      position: "bottomleft"
    });
  
    // the legend design
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 250, 500, 750, 1000];
      var colors = ["#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];
         
      div.innerHTML += "<h3>EQ Significance</h3>"

      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
         "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
           return div;
    };
  
    // Add the legend to the map
    legend.addTo(myMap);
  });
