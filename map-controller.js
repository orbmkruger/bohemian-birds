// build map
L.mapbox.accessToken = "pk.eyJ1Ijoib3JibWtydWdlciIsImEiOiJjaW1kZWZjamcwMDE5dnprazQ1Z2h1dGVzIn0.0xlYPtTK-38IqBKSl-NMnQ";

var map = L.mapbox.map("map", "mapbox.streets", {maxZoom: 7, minZoom: 2})
    .setView([0, 0], 2);

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

function getColor(d){
    return d == 1   ? "green" :
           d == 0.5 ? "orange" :
           d == 0 ? "red" :
           "black";
}

geojson = L.geoJson(statesData,{
	style: function (feature) {
		return {
			color: getColor(matchScore(feature.properties)),
			opacity: matchScore(feature.properties)/2,
			weight: 3,
			fillColor: "grey",
			fillOpacity: 1-matchScore(feature.properties)
		}
	},
	onEachFeature: onEachFeature
}).addTo(map);

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

function highlightFeature(e){
	document.getElementById("info").innerHTML = feature.properties.name;
}

function resetHighlight(e){
	document.getElementById("info").innerHTML = feature.properties.name;
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

$(document).ready(function(){
  $(".bucketlist").change(function(){
    geojson.eachLayer(function(layer){
    	layer.setStyle({
    		color: getColor(matchScore(layer.feature.properties)),
			opacity: matchScore(layer.feature.properties)/2,
    		fillOpacity: 1-matchScore(layer.feature.properties)
    	});
    });
  });
});
