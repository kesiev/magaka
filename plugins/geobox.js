// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A simple geolocalization example. When tapped, shows the current position in a Google maps map.
 */
browse._widgets.geobox={
	global:{
		onpageprepare:function(event) {
			widget.applytouchevents(this,null,null,this.geolocalize);
		},
		geolocalized:function(data) {
		
		},
		cannotgeolocalize:function() {
			this.innerHTML="<div style='width:100%;height:100%;background-color:#cecece;color:#fffff;'>Cannot geolocalize. Sorry.</div>";
		},
		geolocalized:function(position) {
			this.innerHTML="<img style='display:hidden' onload='this.style.display=\"block\"' src='http://maps.google.com/maps/api/staticmap?center="+position.coords.latitude+","+position.coords.longitude+"&zoom=14&size="+this.offsetWidth+"x"+this.offsetHeight+"&maptype=roadmap&markers=color:red|color:red|"+position.coords.latitude+","+position.coords.longitude+"&sensor=false'>";
		},
		enablegeo:function() {
			widget.commonpassivepopup("nogeolocation");
		},
		geolocalize:function() {
			if (navigator&&navigator.geolocation)
				if (widget.isonline())
					navigator.geolocation.getCurrentPosition(widget.launchon(this,this.geolocalized),widget.launchon(this,this.enablegeo));  
				else
					widget.commonpassivepopup("disconnected");
			else
				this.cannotgeolocalize();			
		}
	}
}
