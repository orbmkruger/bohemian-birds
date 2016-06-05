// Provide your access token on mapbox.com
L.mapbox.accessToken = "pk.eyJ1Ijoib3JibWtydWdlciIsImEiOiJjaW94ZWc2bXowMGJzdmttMjF3aXlneGhtIn0.scl7vK6Iddx5vX27IB9U1A";
// Create a map in the div #map
var map = L.mapbox.map("map", "mapbox.streets",{
		minZoom: 2,
		maxZoom: 7,
		maxBounds: [[90,-180],[-90,180]]
}).fitBounds([[65,0],[-25,60]]);
// Create popup
var popup = new L.Popup({ autoPan: false });
// Send mixpanel
// mixpanel.track("map viewed");

// creates the scores 0 , 0.5 , 1
var matchScore = function(props){
	return Math.round(
    .2 * (
			props.wonders * document.getElementById("wonders").checked +
      props.wildlife * document.getElementById("wildlife").checked +
      props.jungle * document.getElementById("jungle").checked +
      props.desert * document.getElementById("desert").checked +
      props.islands * document.getElementById("islands").checked +
      props.winter * document.getElementById("winter").checked +
      props.eco * document.getElementById("eco").checked +
      props.mountains * document.getElementById("mountains").checked +
      props.landscape * document.getElementById("landscape").checked +
      props.wellness * document.getElementById("wellness").checked +
      props.golfing * document.getElementById("golfing").checked +
      props.fishing * document.getElementById("fishing").checked +
      props.beach * document.getElementById("beach").checked +
      props.villa * document.getElementById("villa").checked +
      props.zipline * document.getElementById("zipline").checked +
      props.rafting * document.getElementById("rafting").checked +
      props.parachute * document.getElementById("parachute").checked +
      props.biking * document.getElementById("biking").checked +
      props.watersport * document.getElementById("watersport").checked +
      props.scuba * document.getElementById("scuba").checked +
      props.speed * document.getElementById("speed").checked +
      props.bungee * document.getElementById("bungee").checked +
      props.history * document.getElementById("history").checked +
      props.unesco * document.getElementById("unesco").checked +
      props.food * document.getElementById("food").checked +
      props.museum * document.getElementById("museum").checked +
      props.architecture * document.getElementById("architecture").checked +
      props.locals * document.getElementById("locals").checked +
      props.nightlife * document.getElementById("nightlife").checked +
      props.bbirds * document.getElementById("bbirds").checked +
      props.festival * document.getElementById("festival").checked
		) / (
			$(".bucketlist:checked").length
		)
	) / 2;
}

function getBorderColor(d){
	return d == 1   ? "green" :
	       d == 0.5 ? "orange" :
	       "red";
}

function getRecommendation(d){
	return d == 1   ? "Great choice to empty<br>your bucketlist!" :
	       d == 0.5 ? "Poor match, but happy to help!" :
				 "Sorry mate, no opportunity to empty<br>your bucketlist here";
}

function getStars(d){
	return d == 1   ? "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>" :
	       //d == 0.833   ? "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half-o'></i>" :
				 //d == 0.667   ? "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i>" :
				 d == 0.500   ? "<i class='fa fa-star'></i><i class='fa fa-star-half-o'></i><i class='fa fa-star-o'></i>" :
				 //d == 0.333   ? "<i class='fa fa-star'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>" :
				 //d == 0.167   ? "<i class='fa fa-star-half-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>" :
				 "<i class='fa fa-star-o'></i><i class='fa fa-star-o'></i><i class='fa fa-star-o'></i>";
}

// create activities layer
var activitiesLayer = L.mapbox.featureLayer(activitiesData);

// create countries layer
var countriesLayer = L.geoJson(countriesData,{
	onEachFeature: onEachFeature
});

function onEachFeature(feature, layer) {
	layer.on({
    mousemove: mousemove,
    mouseout: mouseout,
    click: zoomToFeature
	});
}

var closeTooltip;

function mousemove(e){
	if (map.getZoom() <= 3) {
		var layer = e.target;
	  popup.setLatLng(e.latlng);
	  popup.setContent("<div class='marker-title'>" +
			layer.feature.properties.name +
			" " +
			getStars(matchScore(layer.feature.properties)) +
			"</div>" +
			getRecommendation(matchScore(layer.feature.properties)));
	  if (!popup._map) popup.openOn(map);
	  window.clearTimeout(closeTooltip);
	  // highlight feature
	  layer.setStyle({
	    weight: 3,
			opacity: 1
	  });
	  if (!L.Browser.ie && !L.Browser.opera) {
	    layer.bringToFront();
	  }
	}
}

function mouseout(e){
	if (map.getZoom() <= 3) {
		var layer = e.target;
		layer.setStyle({
				weight: 1,
				opacity: matchScore(layer.feature.properties)/(4/3)+0.25
		});
	  closeTooltip = window.setTimeout(function() {
	      map.closePopup();
	  }, 100);
	}
}

function zoomToFeature(e) {
	var layer = e.target;
	if (matchScore(layer.feature.properties) >= 0.5 ) {
		closeTooltip = window.setTimeout(function() {
	      map.closePopup();
	  }, 100);
		// mixpanel.track(layer.feature.properties.name);
		// zoom in to selected country
		map.fitBounds(layer.getBounds());
		// view only activities from selected country
		activitiesLayer.setFilter(function (feature){
				return feature.properties["country"] === layer.feature.id;
			})
			.eachLayer(function(marker){
				marker.setIcon(L.mapbox.marker.icon({
					"marker-color":"#A52A2A",
					"marker-symbol":"star",
					"marker-size":"small"
				}));
			}).addTo(map);
		/* make colors countries transparant
		countriesLayer.eachLayer(function(layer){
			layer.setStyle({
				opacity: 0,
				fillOpacity: 0
			});
		}); */
	}
}

// user actions bucketlist
$(document).ready(function(){
  $(".bucketlist").change(function(){
		var $category = $(this).attr("id");
		if ($(this).is(":checked")) {
			// mixpanel.track($category);
		}
		map.fitBounds([[65,0],[-25,60]]);
		map.removeLayer(activitiesLayer);
		if (map.hasLayer(countriesLayer) == false) {
			countriesLayer.addTo(map);
		}
		if ($(".bucketlist:checked").length == 0 ) {
			map.removeLayer(countriesLayer);
			// show popup "please fill bucket"
		} else {
			countriesLayer.eachLayer(function(layer){
	      layer.setStyle({
					color: getBorderColor(matchScore(layer.feature.properties)),
					weight: 1,
					opacity: matchScore(layer.feature.properties)/(4/3)+0.25,
					fillColor: "grey",
	        fillOpacity: 1-matchScore(layer.feature.properties)
	      });
	    });
		}
  });
});
