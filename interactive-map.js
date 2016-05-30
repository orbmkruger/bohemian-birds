// build map
L.mapbox.accessToken = 'pk.eyJ1Ijoib3JibWtydWdlciIsImEiOiJjaW1kZWZjamcwMDE5dnprazQ1Z2h1dGVzIn0.0xlYPtTK-38IqBKSl-NMnQ';

var map = L.mapbox.map('map', 'mapbox.streets', {maxZoom: 7, minZoom: 2})
    .setView([0, 0], 2);

// creates the scores 0 , 0.5 , 1
var matchScore = function(props){
	return Math.round(.2*(
			props.beach*document.getElementById('wonders').checked +
			props.horse*document.getElementById('horse').checked +
			props.food*document.getElementById('food').checked +
			props.budget*document.getElementById('budget').checked +
			props.sailing*document.getElementById('sailing').checked
		) / (
			document.getElementById('wonders').checked +
			document.getElementById('horse').checked +
			document.getElementById('food').checked +
			document.getElementById('budget').checked +
			document.getElementById('sailing').checked
		)
	)/2;
}

function getColor(d){
    return d == 1   ? 'green' :
           d == 0.5 ? 'orange' :
           d == 0 ? 'red' :
           'black';
}

geojson = L.geoJson(statesData,{
	style: function (feature) {
		return {
			color: getColor(matchScore(feature.properties)),
			opacity: matchScore(feature.properties)/2,
			weight: 3,
			fillColor: 'grey',
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
	document.getElementById('info').innerHTML = feature.properties.name;
}

function resetHighlight(e){
	document.getElementById('info').innerHTML = feature.properties.name;
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

$(document).ready(function(){
  $('.bucketlist').change(function(){
    geojson.eachLayer(function(layer){
    	layer.setStyle({
    		color: getColor(matchScore(layer.feature.properties)),
			opacity: matchScore(layer.feature.properties)/2,
    		fillOpacity: 1-matchScore(layer.feature.properties)
    	});
    });
  });
});
