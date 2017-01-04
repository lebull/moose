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



function tdToggle($td){
	$td._tdState = !$td._tdState;
	$td.onToggle();
	refreshStyles($td);
}

function refreshStyles($td){
	if($td._tdState){
		$td.onOn();
		$td.removeClass(_tdRuntime.styles.off);
		$td.addClass(_tdRuntime.styles.on);
	}else{
		$td.onOff();
		$td.removeClass(_tdRuntime.styles.on);
		$td.addClass(_tdRuntime.styles.off);
	}
}