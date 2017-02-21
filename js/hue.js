hue = {
	
	/**
	 * config: dictionary
	 *  config.path
	 *  config.method, 
	 *  config.data,
	 *  config.success,
	 *  config.error
	 */
	_hubCall: function(config){
		
		var url = huesettings.address 
				+ huesettings.proxyPath 
				+ huesettings.user 
				+ config.path;
		
		console.log("Call: " + config.method + " " + url);
		$.ajax(url,
			{	    
				crossDomain: true,
				method: config.method,
				dataType: 'json',
				data: config.data,
				success: function(data){
					var message = "Success: " + config.method + " " + url;
					console.log(message);
					if(config.success)
					{
						config.success(data); 
					}
				},
				error: function(data){
					var message = "Error: " + config.method + " " + url;
					console.error(message);
					if(config.error){
						config.error(data); 
					}
				}
	   		}
	   	);
	},
	
	refresh: function(success){
		
		var that = this;
		
		this.getData( function(data){
			
			var aChangedLights = that._getChangedLightsFromData(data, that.data);
			

			that.data = data;
			
			if(success){
				success();
			}
		});
		
	},
	
	getData: function(success, error)
	{
		this._hubCall({
			path: "/",
			method: "GET",
			success: success,
			error:  error,
			data: null
		});
	},
	
	getLights: function(success, error){
		
		this._hubCall({
			path: "/lights",
			method: "GET",
			success: success,
			error:  error,
			data: null
		});
	},

	setLight: function(id, state, success, error){
		this._hubCall({
			path:"/lights/" + id + "/state",
			method: "PUT",
			data: JSON.stringify(state),
			success: success,
			error:  error
		});
	},

	turnLightOn: function(key){
		this.setLight(key, {on: true});
	},
	turnLightOff: function(key){
		this.setLight(key, {on: false});
	},
	
	init: function(success){
		this.refresh(success);
	},
	
	getGroupFromLight: function( lightId ){
		if(!this.data){
			this.refresh();
		}
	
		for( var groupId in this.data.groups ){
			var group = this.data.groups[groupId];
			
			if($.inArray(String(lightId), group.lights) !== -1 )
			{
				return group;
			}
		}
		
		return null;
	},
	
	_getChangedLightsFromData: function(data1, data2){
		//TODO: Impliment
		return false;
	},
	
	_onLightChanged: function(lightId){},
	bindOnLightsChanged: function(newFunction){
		this._onLightsChanged = newFunction;
	}
};