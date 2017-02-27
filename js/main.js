
/*UI*/
var rooms = {};


function addRoom(name) {
	var $room = $("<section>", {class: "room"});
	$room.html( "<h2>" + name + "</h2>");
	$('#rooms').append($room);
	
	rooms[name] = $room;
}

function addLight(room, key, light){

	if(!rooms[room]){
		addRoom(room);
	}

	var lightElementId = "light-" + key;

	var $light = $("<button>", {class: "light"})
	$light.html(light.name);
	$light.attr("id", lightElementId);
	
	toggleDiv(
		$light,
		{
			state: light.state.on,
			onOn: function(){ 
				hue.turnLightOn(key);
			},
			onOff: function(){ 
				hue.turnLightOff(key);
			}
		}
	);
	rooms[room].append($light);
}

function setLight(lightId, onOff){
	//console.log("Set " + lightId + " " + onOff);
	$td = $("#light-" + lightId);
	tdSetState($td, onOff, true);
}

/*Events*/
function periodicRefresh(){
	hue.refresh();
}

function onInit(){
	for(var lightId in hue.data.lights){
			addLight(
				hue.getGroupFromLight(lightId).name, 
				lightId, 
				hue.data.lights[lightId]
			); 
		}
}

function onLightsChange(dLights){
		for( var lightId in dLights)
		{
			setLight( lightId, dLights[lightId].state.on );
		}
}

$(document).ready( function(){
	hue.bindOnLightsChanged(onLightsChange);
	hue.init(onInit);
	//periodicRefresh();
	//setInterval(periodicRefresh, 3000);
});

