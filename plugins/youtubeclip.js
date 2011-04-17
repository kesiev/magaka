// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A youtube clip embedder that uses the HTML5 way
 * Parameters:
 *  videoid: the youtube video ID to embed
 *  playbutton: play button image overlayed over the thumb
 *  thumbid: the youtube thumbnail ID (omit for the first one)
 *
 * Notes: Implements the one-media-at-time event "onmediastarting" event that allow just an
 *        media playing a the same time.
 */
browse._widgets.youtubeclip={
	global:{
		onpageprepare:function(event) {
			var thumbid=this.getAttribute("thumbid");
			var playbutton=this.getAttribute("playbutton");
			this._videoid=this.getAttribute("videoid");
			this._thumb=null;
			if (widget.isonline()) 
				this._thumb=widget.makediv({x:"0px",y:"0px",rx:"0px",ry:"0px",html:"<img src='http://img.youtube.com/vi/"+this._videoid+"/"+(thumbid?thumbid:"1")+".jpg' style='width:100%;height:100%'>",css:{zIndex:1}},this);
			else
				this._thumb=widget.makediv({x:"0px",y:"0px",rx:"0px",ry:"0px",css:{zIndex:1,backgroundColor:"#cecece"}},this);
			widget.makediv({x:"0px",y:"0px",rx:"0px",ry:"0px",css:{backgroundImage:"url('"+playbutton+"')",backgroundRepeat:"no-repeat",backgroundPosition:"center",zIndex:1}},this._thumb);
			this._video=widget.makediv({x:"0px",y:"0px",rx:"0px",ry:"0px",css:{backgroundColor:"black"}},this);
			widget.applytouchevents(this,null,null,this.startplay);
			this.onpageshow();
		},
		onpageshow:function() {
			this._thumb.style.display="block";
		},
		onpagedrag:function() {
			this.stopplayer();
		},
		stopplayer:function() {
			this._thumb.style.display="block";
			this._video.innerHTML="";
		},
		onmediastarting:function(d) {
			if (d.caller!=this) // Exclude the caller from the onmediastarting event.
				if (this._video.innerHTML) this.stopplayer();
		},
		onpageleave:function() {
			this.stopplayer();
		},
		startplay:function(event) {
			if (widget.isonline()) { 
				widget.broadcastevent(this,"onmediastarting",{caller:this});		
				this._video.innerHTML="<iframe class=\"youtube-"+this._videoid+"\" type=\"text/html\" width=\""+this.offsetWidth+"\" height=\""+this.offsetHeight+"\" src=\"http://www.youtube.com/embed/"+this._videoid+"?autoplay=1\" frameborder=\"0\"><br /></iframe>";
				this._thumb.style.display="none";
			} else widget.commonpassivepopup("disconnected");
		}
	}
}
