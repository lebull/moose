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
	
	refreshStyles($td);
}

function tdSetState($td, state){
	$td._tdState = state;
		if($td._tdState){
		$td.onOn();
	}else{
		$td.onOff();
	}
	refreshStyles($td);
}

function tdToggle($td){
	tdSetState($td, !$td._tdState);
}

function refreshStyles($td){
	if($td._tdState){
		$td.removeClass(_tdRuntime.styles.off);
		$td.addClass(_tdRuntime.styles.on);
	}else{
		$td.removeClass(_tdRuntime.styles.on);
		$td.addClass(_tdRuntime.styles.off);
	}
}