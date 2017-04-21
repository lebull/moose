
/*UI*/
var rooms = {};


function addRoom(name) {
	var $room = $("<section>", {class: "room"});
	$room.html( "<h2>" + name + "</h2>");
	$('#rooms').append($room);
	
	rooms[name] = $room;
}

function addScene(room, key, scene){

	if(!rooms[room]){
		addRoom(room);
	}

	var elementId = "scene-" + key;

	var $scene = $("<button>", {class: "scene"})
		.click(function(){ hue.setScene(key); });
	$scene.html(scene.name);
	$scene.attr("id", elementId);

	rooms[room].append($scene);
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

	for(var sceneId in hue.data.scenes)
	{
			addScene(
				hue.getGroupsFromScene(sceneId)[0].name,
				//hue.data.scenes[sceneId].name, 
				sceneId, 
				hue.data.scenes[sceneId]
			); 
	}
	
	for(var roomId in rooms)
	{
		rooms[roomId].append("<br />");
	}

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

