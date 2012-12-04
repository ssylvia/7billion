$(document).ready(function(){
	$("#tabArea").prepend("<div id='introButton' class='tab'><p class='tabText'>INTRODUCTION</p></div>");
	$("#introButton").click(function(e) {
        $("#modalBackground").fadeIn('slow');
		$("#intro").fadeIn('slow');
    });
	$("#modalBackground").fadeTo('fast', '0.9');
		$("#intro").css('left',(($(document).width()/2)-400));
		$("#intro").fadeIn();
		$("#continue").fadeIn();
		$("#continue").click(function (){
			$("#modalBackground").fadeOut('slow');
			$("#intro").fadeOut('slow');
		});
		$("#introImg").load(function(e) {
			if(($("#introImg").width()) == 405){
				$("#introImg").css("margin-top",(((455-($("#introImg").height()))/2)+15));
				$("#introImg").css("margin-right",(((420-($("#introImg").width()))/2)+15));
			}
			else{
				$("#introImg").css("margin-right",(((420-($("#introImg").width()))/2)+15));
				$("#introImg").css("margin-top",(((455-($("#introImg").height()))/2)+15));
			}
			$("#introImg").show();
		});
		$('#introTab').click(function(){
			intro();
		});
});

function setupLayout(){
	if(configOptions.webmaps.length > 1){
		//dojo.style(dojo.byId("banner"), "height", "150px");
	}
	if (configOptions.displayDescription == false && configOptions.displayLegend == false){
		dojo.style(dojo.byId("leftPane"), "display", "none");	
	}
	else if (configOptions.displayDescription == true && configOptions.displayLegend == false){
		dojo.style(dojo.byId("legendHeader"), "display", "none");
		dojo.style(dojo.byId("legendPanel"), "display", "none");
		dojo.style(dojo.byId("descriptionPanel"), "height", "100%");		
	}
	else if (configOptions.displayDescription == false && configOptions.displayLegend == true){
		dojo.style(dojo.byId("descriptionPanel"), "display", "none");
		dojo.style(dojo.byId("legendHeader"), "display", "none");
		dojo.style(dojo.byId("legendPanel"), "height", "100%");		
	}
	else{
		resetLayout();
	}
}

function addTabsAndTime(){
	if(configOptions.webmaps.length > 1 && timeInterface == true){
		dojo.style(dojo.byId("banner"), "height", "195px");
	}
	else if(configOptions.webmaps.length == 1 && timeInterface == true){
		dojo.style(dojo.byId("banner"), "height", "150px");
	}
	else if (configOptions.webmaps.length > 1 && timeInterface == false){
		dojo.style(dojo.byId("banner"), "height", "150px");
	}
	dijit.byId("mainWindow").layout();
	setupLayout();
}

function resetLayout(){
	if (configOptions.displayDescription == true && configOptions.displayLegend == true){
		legendHeight = dojo.style(dojo.byId("leftPane"),"height") - dojo.style(dojo.byId("descriptionPanel"),"height") - dojo.style(dojo.byId("legendHeader"),"height")-10;
		if (dojo.isIE != null){
			legendHeight = dojo.style(dojo.byId("leftPane"),"height") - (dojo.style(dojo.byId("leftPane"),"height")*0.45) - dojo.style(dojo.byId("legendHeader"),"height");
		}
		dojo.style(dojo.byId("legendPanel"),"height",legendHeight+"px");
	}
	dijit.byId("mainWindow").layout();
}

function changeMap(index){
	if (mapsReady == true){
		
		cm = index;
		
		var currentMap = dojo.byId("mapDiv"+cm);
		
		dojo.forEach(dojo.query(".tab"),function(node){
			dojo.removeClass(node,"selected");
		});
		dojo.addClass(dojo.byId("tab"+cm),"selected");
		dojo.forEach(_maps,function(map,i){
			if(cm != i){
				dojo.fadeOut({
					node: dojo.byId("mapDiv"+i),
					duration: 500
				}).play();
				dojo.style(dojo.byId("legend"+i),"display","none");
				dojo.style(dojo.byId("title"+i),"display","none");
				dojo.style(dojo.byId("description"+i),"display","none");
			}
			else{
				dojo.fadeIn({
					node: dojo.byId("mapDiv"+i),
					duration: 500
				}).play();
				dojo.style(dojo.byId("legend"+i),"display","block");
				dojo.style(dojo.byId("title"+i),"display","block");
				dojo.style(dojo.byId("description"+i),"display","block");
			}
		});
		dojo.place(currentMap,dojo.byId('mapPane'),'last');
		if (_timeProperties[cm] != null){
			if (_thumbIndexes[cm] != null){
				timeSlider.setThumbIndexes(_thumbIndexes[cm]);
			}
			else{
				timeSlider.setThumbIndexes([0,1]);
			}
			dojo.fadeOut({
				node: dojo.byId("timeSliderBlind"),
				duration: 500
			}).play();
			var t = setTimeout("dojo.style(dojo.byId('timeSliderBlind'),'display','none')",500);
			
			dojo.fadeIn({
				node: dojo.byId("timeDisplay"),
				duration: 500
			}).play();
			dojo.style(dojo.byId('timeDisplay'),'z-index','100');
						
			var startTime = _timeProperties[cm].startTime;
			var endTime = _timeProperties[cm].endTime;
		    var fullTimeExtent = new esri.TimeExtent(new Date(startTime), new Date(endTime));
			
			timeSlider.setThumbCount(_timeProperties[cm].thumbCount);
		    timeSlider.setThumbMovingRate(_timeProperties[cm].thumbMovingRate);
			
			if(_timeProperties[cm].numberOfStops){
				timeSlider.createTimeStopsByCount(fullTimeExtent,_timeProperties[cm].numberOfStops);
		  	}
			else{
				timeSlider.createTimeStopsByTimeInterval(fullTimeExtent,_timeProperties[cm].timeStopInterval.interval,_timeProperties[cm].timeStopInterval.units);
		  	}
			
			timeSlider.setTickCount(timeSlider.timeStops.length);
			
			dojo.forEach(_maps, function(map,i){
				if (_timeProperties[i] != null){
					if (cm != i){
						map.setTimeSlider();
					}
					else{
						map.setTimeSlider(timeSlider);
					}
				}
			});
			
			centerTimeDisplay();			
		}
		else{
			dojo.fadeOut({
				node: dojo.byId("timeDisplay"),
				duration: 500
			}).play();
			var t = setTimeout("dojo.style(dojo.byId('timeDisplay'),'z-index','0')",500);
			dojo.style(dojo.byId("timeSliderBlind"),"display","block");
			var fadeto = {
				node: dojo.byId("timeSliderBlind"),
				duration: 500,
				onAnimate: function(o){
					if(o.opacity >= 0.75){
        				fade.stop();
					}
				}
			}
			var fade = dojo.fadeIn(fadeto).play();
		}
	}
}

function centerTimeDisplay(){
	var timeDiv = dojo.position('timeDisplay', true);
	var mapDiv = dojo.position('mapPane', true);
	var posLeft = (mapDiv.w/2) - (timeDiv.w/2);
	dojo.style(dojo.byId("timeDisplay"),"left",posLeft+"px");
}

function changeLegend(){
		if(dojo.byId('legend0_msg').innerHTML == "Creating legend..."){
			var t = setTimeout("changeLegend()",10);
		}
		else{
			dojo.query('#legend0_World_Major_Lakes_8457').forEach(function(node){
				dojo.style(node,"display","none")
			});
            dojo.query('#legend2_World_Major_Lakes_4023').forEach(function(node){
    			dojo.style(node,"display","none")
			});
            dojo.query('#legend1_World_Major_Lakes_7125').forEach(function(node){
    			dojo.style(node,"display","none")
			});
		}
	}