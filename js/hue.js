
hue = {
	getLights: function(success, error){
		$.ajax(huesettings.url + "/lights/",
			{	    
				crossDomain: true,
				method: "GET",
				dataType: 'json',
				success: function(data){ success(data); },
				error: function(data){ error(data); }
	   		}
	   	);
	},

	setLight: function(id, state, success, error){
		$.ajax(huesettings.url + "/lights/" + id + "/state",
			{	    
				crossDomain: true,
				method: "PUT",
				data: JSON.stringify(state),
				dataType: 'json',
				success: function(data){ success(data); },
				error: function(data){ error(data); }
	   		}
	   	);
	},

	turnLightOn: function(key){
		this.setLight(key, {on: true}, echo, echo);

	},
	turnLightOff: function(key){
		this.setLight(key, {on: false}, echo, echo);
	}
}

function echo(data){
	console.log(data);
}
/*
$(document).ready(
	function(){
		hue.getLights(function(data){console.log(data);});
		//hue.turnLightOn(8);
		//hue.turnLightOff(8);
	}

);*/

