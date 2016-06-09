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
			props.airsport * document.getElementById("airsport").checked +
			props.highspeed * document.getElementById("highspeed").checked +
			props.river * document.getElementById("river").checked +
			props.watersport * document.getElementById("watersport").checked +
			props.zipline * document.getElementById("zipline").checked +
			props.desert * document.getElementById("desert").checked +
			props.gems * document.getElementById("gems").checked +
			props.island * document.getElementById("island").checked +
			props.jungle * document.getElementById("jungle").checked +
			props.mothernature * document.getElementById("mothernature").checked +
			props.mountain * document.getElementById("mountain").checked +
			props.underwater * document.getElementById("underwater").checked +
			props.water * document.getElementById("water").checked +
			props.wildlife * document.getElementById("wildlife").checked +
			props.foodlover * document.getElementById("foodlover").checked +
			props.newwonder * document.getElementById("newwonder").checked +
			props.oldwonder * document.getElementById("oldwonder").checked +
			props.beach * document.getElementById("beach").checked +
			props.golf * document.getElementById("golf").checked +
			props.villa * document.getElementById("villa").checked +
			props.wellness * document.getElementById("wellness").checked +
			props.festival * document.getElementById("festival").checked +
			props.locals * document.getElementById("locals").checked +
			props.party * document.getElementById("party").checked
		) / (
			$(".bucketlist:checked").length
		)
	) / 2;
}

function getBorderColor(d){
	return d == 1   ? "green" :
	       d == 0.5 ? "orange" :
	       "grey";
}
function getRecommendation(d){
	return d == 1   ? " a great choice! Click to view the activities." :
	       d == 0.5 ? " not the best match, but happy to help!" :
				 " no opportunity to empty your selected bucketlist";
}
function getStars(d){
	return d == 1   ? "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i>" :
	       //d == 0.833   ? "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-half-o'></i>" :
				 //d == 0.667   ? "<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star-o'></i>" :
				 d == 0.5   ? "<i class='fa fa-star'></i><i class='fa fa-star-half-o'></i><i class='fa fa-star-o'></i>" :
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
	  $("#info").html(layer.feature.properties.name +
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
		// add country-info
		var mapWidth = $("#map").outerWidth();
		$("#map").width(mapWidth - "250");
		$("#map").css("right","250px");
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
		// hide country again
		if ($("#country").is(":visible")) {
			var documentWidth = $(document).width();;
			$("#country").hide();
			$("#map").css("right","0px");
			$("#map").width(documentWidth - "250");
		}
		var documentWidth = $(document).width();;
		map.fitBounds([[65,0],[-25,60]]);
		map.removeLayer(activitiesLayer);
		if (map.hasLayer(countriesLayer) == false) {
			countriesLayer.addTo(map);
		}
		if ($(this).is(":checked")) {
			$(this).next().css("visibility","visible");
		} else {
			$(this).next().css("visibility","hidden");
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
