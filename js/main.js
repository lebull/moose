

var rooms = {};

function initToggle(tog){
	toggleDiv(tog, {})
	/*
	tog.toggles({
		drag: true, // allow dragging the toggle between positions
		click: true, // allow clicking on the toggle
		text: {
			on: 'On', // text for the ON position
			off: 'Off' // and off
		},
		on: false, // is the toggle ON on init
		animate: 250, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 100, // width used if not set in css
		height: 40, // height if not set in css
		//type: 'compact' // if this is set to 'select' then the select style toggle will be used
	});*/
	
}


function addRoom(name) {
	var $room = $("<section>", {class: "room"});
	$room.html( "<h2>" + name + "</h2>");
	$('#rooms').append($room);
	
	rooms[name] = $room;
}

function addLight(room, name){
	var $light = $("<button>", {class: "light"})
	$light.html(name);
	initToggle($light);
	rooms[room].append($light);
}

$(document).ready( function(){ 
	addRoom("Living Room");
	addLight("Living Room", "Test1"); 
	addLight("Living Room", "Test2");
	addLight("Living Room", "Test3"); 
});

