// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A simple full screen image viewer.
 * Parameters:
 *  fullscreenimage: the image to be shown fullscreen
 *  fullscreentext: the photo text
 */
browse._widgets.fullscreenimage={
	global:{
		onpageprepare:function(event) {
			widget.applytouchevents(this,null,null,this.showimage);
		},
		showimage:function(event) {
			var html="";
			html+="<div style=\"width:100%;height:100%;background-color:black;background-image:url('"+this.getAttribute("fullscreenimage")+"');background-repeat:no-repeat;background-position:center;\" onpageshow=\"widget.applytouchevents(this,null,null,function(){widget.hidemodal()})\">";			
			html+="<div style=\"background-color:#000000;padding:10px;position:absolute;text-align:center;width:100%;bottom:0px;color:#ffffff;font-family:helvetica\">"+this.getAttribute("fullscreentext")+"</div>";
			html+="</div>";
			widget.showmodal({html:html},"opacity");
		}
	}
}