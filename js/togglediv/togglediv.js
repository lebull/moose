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

function tdSetState($td, state, soft){
	$td._tdState = state;
	
	if(!soft){
		if($td._tdState){
			$td.onOn();
		}else{
			$td.onOff();
		}		
	}

	_refreshStyles($td);
}

function tdToggle($td){
	tdSetState($td, !$td._tdState);
}

function _refreshStyles($td){
	if($td._tdState){
		$td.removeClass(_tdRuntime.styles.off);
		$td.addClass(_tdRuntime.styles.on);
	}else{
		$td.removeClass(_tdRuntime.styles.on);
		$td.addClass(_tdRuntime.styles.off);
	}
}