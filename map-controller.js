// Provide your access token on mapbox.com
L.mapbox.accessToken = "pk.eyJ1Ijoib3JibWtydWdlciIsImEiOiJjaW94ZWc2bXowMGJzdmttMjF3aXlneGhtIn0.scl7vK6Iddx5vX27IB9U1A";
// Create a map in the div #map
var map = L.mapbox.map("map", "orbmkruger.0aej3kk1",{
		minZoom: 2,
		maxZoom: 8,
		maxBounds: [[90,-180],[-90,180]],
		maxBoundsViscosity: 0.5,
		tileLayer: {
			// This map option disables world wrapping. by default, it is false.
			continuousWorld: false,
			// This option disables loading tiles outside of the world bounds.
			noWrap: true
		}
}).fitBounds([[65,0],[-25,60]]);
// add coordinates map to url
var hash = L.hash(map);
// Create popup
var popup = new L.Popup({ autoPan: false });
// Send mixpanel
// mixpanel.track("map viewed");

var firstStep = "First, let us know what your bucketlist is";
var secondStep = "Curious how you can empty them? Select a country.";
var thirdStep = "Like the bucketlist experiences? Get a free proposal!";
$("#info").html(firstStep);

// creates the scores 0 , 0.5 , 1
var matchScore = function(props){
	return Math.round(
    .2 * (
			props.wonders * $("#wonders").is(":checked") +
      props.wildlife * $("#wildlife").is(":checked") +
      props.jungle * $("#jungle").is(":checked") +
      props.desert * $("#desert").is(":checked") +
      props.islands * $("#islands").is(":checked") +
      props.winter * $("#winter").is(":checked") +
      props.eco * $("#eco").is(":checked") +
      props.mountains * $("#mountains").is(":checked") +
      props.landscape * $("#landscape").is(":checked") +
      props.wellness * $("#wellness").is(":checked") +
      props.golfing * $("#golfing").is(":checked") +
      props.fishing * $("#fishing").is(":checked") +
      props.beach * $("#beach").is(":checked") +
      props.villa * $("#villa").is(":checked") +
      props.zipline * $("#zipline").is(":checked") +
      props.rafting * $("#rafting").is(":checked") +
      props.parachute * $("#parachute").is(":checked") +
      props.biking * $("#biking").is(":checked") +
      props.watersport * $("#watersport").is(":checked") +
      props.scuba * $("#scuba").is(":checked") +
      props.speed * $("#speed").is(":checked") +
      props.bungee * $("#bungee").is(":checked") +
      props.history * $("#history").is(":checked") +
      props.unesco * $("#unesco").is(":checked") +
      props.food * $("#food").is(":checked") +
      props.museum * $("#museum").is(":checked") +
      props.architecture * $("#architecture").is(":checked") +
      props.locals * $("#locals").is(":checked") +
      props.nightlife * $("#nightlife").is(":checked") +
      props.bbirds * $("#bbirds").is(":checked") +
      props.festival * $("#festival").is(":checked")
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
	return d == 1   ? "great choice! Click view the activities." :
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

function mousemove(e){
	if (map.getZoom() <= 3) {
		var layer = e.target;
	  $("#info").html(layer.feature.properties.name + " a " +
			getRecommendation(matchScore(layer.feature.properties))
		);
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
		$("#info").html(secondStep);
	}
}

function zoomToFeature(e) {
	var layer = e.target;
	if (matchScore(layer.feature.properties) >= 0.5 ) {
		// mixpanel.track(layer.feature.properties.name);
		closeTooltip = window.setTimeout(function() {
	      map.closePopup();
	  }, 100);
		// remove bucketlist and add country-info
		$("#bucketlist").hide();
		$("#map").css("left","0");
		$("#info").css("left","0");
		$("#info").html(thirdStep);
		$("#country > h1").html(layer.feature.properties.name);
		$("#country").show();
		// zoom in to selected country
		map.fitBounds(layer.getBounds());
		// view only activities from selected country
		activitiesLayer.setFilter(function (feature){
				return feature.properties["country"] === layer.feature.id;
			})
			.eachLayer(function(layer){
				layer.setIcon(L.mapbox.marker.icon({
					"marker-color":"#A52A2A",
					"marker-symbol":"star"
				}));
		    layer.bindPopup("<b>" + layer.feature.properties.title + "</b><br><img src='activity.png'>");
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
			$("#info").html(firstStep);
			map.removeLayer(countriesLayer);
			// show popup "please fill bucket"
		} else {
			$("#info").html(secondStep);
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
