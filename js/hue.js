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
		
		var url = huesettings.proxyAddress + config.path;
		
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
		
		this.getData( function(newData){
			
			if(!that.data)
			{
				that.data = newData;
			}else{
				
				var oldData = that.data
				
				that.data = newData;
				
				var dChangedLights = that._getChangedLightsFromData(newData, oldData);
				if (!$.isEmptyObject(dChangedLights)){
					that._onLightsChange(dChangedLights);
				}
			}
			
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
		
		var that = this;
		
		this._hubCall({
			path:"/lights/" + id + "/state",
			method: "PUT",
			data: JSON.stringify(state),
			success: function(data){
				
				//Merge changes with current data
				for(var key in state)
				{
					that.data.lights[id].state[key] = state[key];
				}

				if(that._onLightsChange)
				{
					that._onLightsChange({id: that.data.lights[id]});
				}
				
				if(success){
					success(data);
				}
			},
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
	
	
	setScene: function(sceneId, success, error){
		//var sceneId = "0MAEgugSd1Ou7Mg";
		
		aGroups = this.getGroupsFromScene(sceneId);
		
		for(var i = 0; i < aGroups.length; i++)
		{
			this._hubCall({
				path:"/groups/" + groupId + "/action",
				method: "PUT",
				data: JSON.stringify({"scene":sceneId}),
				success: success,
				error: error
			});
		}
	},
	
	getGroupsFromScene: function(sSceneId){
		
		aGroups = [];
		
		aLights = hue.data.scenes[sSceneId].lights;
		
		for(var i = 0; i < aLights.length; i++){
			aGroups.push(
				this.getGroupFromLight(aLights[i])
			);
		}
		
		return aGroups;
	},
		
	_getChangedLightsFromData: function(newData, oldData){
		//TODO: Impliment
		//return false;
		
		var dReturnLights = {};
		
		for( var lightId in newData.lights)
		{
			//Make sure equivilancy is working here
			if(JSON.stringify(newData.lights[lightId]) 
					!== JSON.stringify(oldData.lights[lightId]))
			{
				dReturnLights[lightId] = newData.lights[lightId];
				console.log("Light " + lightId + " has changed.");
			}
			

		}
		
		return dReturnLights;
		
	},
	
	_onLightsChange: function(dLights){},
	bindOnLightsChanged: function(newFunction){
		this._onLightsChange = newFunction;
	}
};