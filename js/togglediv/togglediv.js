/**
* Config:
*  onOn
*  onOff
*  onToggle
*
* Methods:
*  toggleDiv
*  tdToggle
*  
**/


_tdRuntime = {
	styles : {
		defaultClass	: "togglediv",
		on				: "togglediv-on",
		off				: "togglediv-off"
	}
}


function toggleDiv( $td, config ){

	$td._tdState = false;
	if(config.state)
	{
		$td._tdState = config.state;
	}
	
	
	$td.onOn = function(){};
	if(config.onOn)
	{
		$td.onOn = config.onOn;
	}
	
	$td.onOff = function(){};
	if(config.onOff)
	{
		$td.onOff = config.onOff;
	}
	
	$td.onToggle = function(){};
	if(config.onToggle)
	{
		$td.onToggle = config.onToggle;
	}
	
	$td.click(
		function(){ tdToggle($td); }
	)
	
	$td.addClass(_tdRuntime.styles.defaultClass);
	$td.addClass(_tdRuntime.styles.defaultCustom);
	
	_refreshStyles($td);
}

function tdSetState($td, state, soft = false){
	$td._tdState = state;
	
	if(!soft){
		if($td._tdState){
			$td.onOn();
		}else{
			$td.onOff();
		}		
	}

	_refreshStyles($td, soft);
}

function tdToggle($td){
	tdSetState($td, !$td._tdState);
}

function _refreshStyles($td, soft = false){
	
	var duration = 50;
	if(soft){
		duration = 750;
	}

	if($td._tdState !== $td.hasClass(_tdRuntime.styles.on))
	{
		$td.toggleClass(_tdRuntime.styles.on, duration);
	}

	
}