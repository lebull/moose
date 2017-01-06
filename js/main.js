

var rooms = {};


function addRoom(name) {
	var $room = $("<section>", {class: "room"});
	$room.html( "<h2>" + name + "</h2>");
	$('#rooms').append($room);
	
	rooms[name] = $room;
}

function addLight(room, name){
	var $light = $("<button>", {class: "light"})
	$light.html(name);
	toggleDiv(
		$light,
		{
			onOn: function(){ 
				//Light changing code here.
			}
		}
	);
	rooms[room].append($light);
}

$(document).ready( function(){ 
	addRoom("Living Room");
	addLight("Living Room", "Test1"); 
	addLight("Living Room", "Test2");
	addLight("Living Room", "Test3"); 
	addLight("Living Room", "Test4"); 
	addLight("Living Room", "Computer Room"); 
	
	addRoom("Throne Room");
	addLight("Throne Room", "Throne Room");
	
	addRoom("Bed Room");
	addLight("Bed Room", "Bed Room"); 
	
});

