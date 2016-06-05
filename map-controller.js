// Provide your access token on mapbox.com
L.mapbox.accessToken = "pk.eyJ1Ijoib3JibWtydWdlciIsImEiOiJjaW94ZWc2bXowMGJzdmttMjF3aXlneGhtIn0.scl7vK6Iddx5vX27IB9U1A";
// Create a map in the div #map
var map = L.mapbox.map("map", "mapbox.streets", {maxZoom: 7, minZoom: 1}).setView([28,0],1);
// Create popup
var popup = new L.Popup({ autoPan: false });
// mixpanel.track("map viewed");

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
           "red";
}

function getRecommendation(d){
    return d == 1   ? "Great choice to empty<br>your bucketlist!" :
           d == 0.5 ? "Sure you want to go here?" :
           "Sorry mate, no opportunity to empty<br>your bucketlist here";
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
	if (map.getZoom() <= 2) {
		var layer = e.target;
	  popup.setLatLng(e.latlng);
	  popup.setContent("<div class='marker-title'>" +
			layer.feature.properties.name + "</div>" +
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
	if (map.getZoom() <= 2) {
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
		map.setView([28,0],1);
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
