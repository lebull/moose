

var rooms = {};


function addRoom(name) {
	var $room = $("<section>", {class: "room"});
	$room.html( "<h2>" + name + "</h2>");
	$('#rooms').append($room);
	
	rooms[name] = $room;
}

function addLight(room, key, light){
	var $light = $("<button>", {class: "light"})
	$light.html(light.name);
	toggleDiv(
		$light,
		{
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

$(document).ready( function(){
	addRoom("Living Room");

	hue.getLights(
		function(data){
			for(var key in data){
				addLight("Living Room", key, data[key]); 
			}
		},
		function(error){
			console.log(error);
		}
	);



	/*
	addLight("Living Room", "Test1"); 
	addLight("Living Room", "Test2");
	addLight("Living Room", "Test3"); 
	addLight("Living Room", "Test4"); 
	addLight("Living Room", "Computer Room"); 
	
	addRoom("Throne Room");
	addLight("Throne Room", "Throne Room");
	
	addRoom("Bed Room");
	addLight("Bed Room", "Bed Room"); 
	*/
	
});

