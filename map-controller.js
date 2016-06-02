// Provide your access token on mapbox.com
L.mapbox.accessToken = 'pk.eyJ1Ijoib3JibWtydWdlciIsImEiOiJjaW94ZWc2bXowMGJzdmttMjF3aXlneGhtIn0.scl7vK6Iddx5vX27IB9U1A';
// Create a map in the div #map
var map = L.mapbox.map('map', 'mapbox.streets', {maxZoom: 7, minZoom: 2}).setView([0,0],2);

// creates the scores 0 , 0.5 , 1
var matchScore = function(props){
	return Math.round(
    .2*(
			props.wonders*document.getElementById("wonders").checked +
      props.wildlife*document.getElementById("wildlife").checked +
      props.jungle*document.getElementById("jungle").checked +
      props.desert*document.getElementById("desert").checked +
      props.islands*document.getElementById("islands").checked +
      props.winter*document.getElementById("winter").checked +
      props.eco*document.getElementById("eco").checked +
      props.mountains*document.getElementById("mountains").checked +
      props.landscape*document.getElementById("landscape").checked +
      props.wellness*document.getElementById("wellness").checked +
      props.golfing*document.getElementById("golfing").checked +
      props.fishing*document.getElementById("fishing").checked +
      props.beach*document.getElementById("beach").checked +
      props.villa*document.getElementById("villa").checked +
      props.zipline*document.getElementById("zipline").checked +
      props.rafting*document.getElementById("rafting").checked +
      props.parachute*document.getElementById("parachute").checked +
      props.biking*document.getElementById("biking").checked +
      props.watersport*document.getElementById("watersport").checked +
      props.scuba*document.getElementById("scuba").checked +
      props.speed*document.getElementById("speed").checked +
      props.bungee*document.getElementById("bungee").checked +
      props.history*document.getElementById("history").checked +
      props.unesco*document.getElementById("unesco").checked +
      props.food*document.getElementById("food").checked +
      props.museum*document.getElementById("museum").checked +
      props.architecture*document.getElementById("architecture").checked +
      props.locals*document.getElementById("locals").checked +
      props.nightlife*document.getElementById("nightlife").checked +
      props.bbirds*document.getElementById("bbirds").checked +
      props.festival*document.getElementById("festival").checked
		) / (
			document.getElementById("wonders").checked +
      document.getElementById("wildlife").checked +
      document.getElementById("jungle").checked +
      document.getElementById("desert").checked +
      document.getElementById("islands").checked +
      document.getElementById("winter").checked +
      document.getElementById("eco").checked +
      document.getElementById("mountains").checked +
      document.getElementById("landscape").checked +
      document.getElementById("wellness").checked +
      document.getElementById("golfing").checked +
      document.getElementById("fishing").checked +
      document.getElementById("beach").checked +
      document.getElementById("villa").checked +
      document.getElementById("zipline").checked +
      document.getElementById("rafting").checked +
      document.getElementById("parachute").checked +
      document.getElementById("biking").checked +
      document.getElementById("watersport").checked +
      document.getElementById("scuba").checked +
      document.getElementById("speed").checked +
      document.getElementById("bungee").checked +
      document.getElementById("history").checked +
      document.getElementById("unesco").checked +
      document.getElementById("food").checked +
      document.getElementById("museum").checked +
      document.getElementById("architecture").checked +
      document.getElementById("locals").checked +
      document.getElementById("nightlife").checked +
      document.getElementById("bbirds").checked +
      document.getElementById("festival").checked
		)
	)/2;
}

function getBorderColor(d){
    return d == 1   ? "green" :
           d == 0.5 ? "orange" :
           d == 0 ? "red" :
           "grey";
}

// create countries layer
var countriesLayer = L.geoJson(countriesData,{
	onEachFeature: onEachFeature
});

// create activities layer
var activitiesLayer = L.mapbox.featureLayer(activitiesData);

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

function highlightFeature(e){
}

function resetHighlight(e){
	document.getElementById("info").innerHTML = feature.properties.name;
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
	activitiesLayer.setFilter(function (){
		return true;
	})
	.eachLayer(function(marker){
		marker.setIcon(L.mapbox.marker.icon({
			"marker-color":"#A52A2A",
			"marker-symbol":"star",
			"marker-size":"small"
		}));
	}).addTo(map);
	// filter activities from selected country
	countriesLayer.eachLayer(function(layer){
		layer.setStyle({
			opacity: 0,
			fillOpacity: 0
		});
	});
}

// actions based on bucketlist
$(document).ready(function(){
  $(".bucketlist").change(function(){
		var category = $(this).attr("id");
		alert("bucketlist " + category + " clicked");
		// mixpanel.track("test");
		map.setView([0,0],2);
		map.removeLayer(activitiesLayer);
		if (map.hasLayer(countriesLayer) == false) {
			countriesLayer.addTo(map);
		}
    countriesLayer.eachLayer(function(layer){
      layer.setStyle({
				color: getBorderColor(matchScore(layer.feature.properties)),
				weight: 3,
				opacity: matchScore(layer.feature.properties)/2,
				fillColor: "grey",
        fillOpacity: 1-matchScore(layer.feature.properties)
      });
    });
  });
});
