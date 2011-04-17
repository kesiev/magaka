// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A plain simple audio player.
 * Parameters:
 *  audiofiles: the audio file to be played. use "mimetype:file,mimetype:file,..."
 *  offlineresource: if set, the audio is played also if the device is offline. Make sure to add the audio file to your manifest.
 *
 * Notes: Implements the one-media-at-time event "onmediastarting" event that allow just an
 *        media playing a the same time.
 */
browse._widgets.audioclip={
	global:{
		onpageprepare:function(event) {
			widget.applytouchevents(this,null,null,this.toggleplay);
			this._playing=false;
			this.updateplayer();
		},
		onpageshow:function() {
			this._offlineresource=this.getAttribute('offlineresource');
			this._audio=document.createElement('audio');
			var sources=this.getAttribute('audiofiles').split(",");
			for (var i=0;i<sources.length;i++) {
				var elm=sources[i].split(":");
				var src=document.createElement('source');
				src.setAttribute("type",elm[0]);
				src.setAttribute("src",elm[1]);
				this._audio.appendChild(src);
			}
			this._playing=false;
			this.updateplayer();
		},
		onmediastarting:function(d) {
			if (d.caller!=this) // Exclude the caller from the onmediastarting event.
				if (this._playing) this.toggleplay();
		},
		updateplayer:function() {
			for (var i=0;i<this.childNodes.length;i++)
				if (this.childNodes[i].getAttribute)
					if (this._playing)
						this.childNodes[i].style.display=(this.childNodes[i].getAttribute("showon")=="playing"?"block":"none");
					else
						this.childNodes[i].style.display=(this.childNodes[i].getAttribute("showon")=="stop"?"block":"none");
		},
		onpageleave:function() {
			if (this._audio&&this._audio.pause) this.stopplayer();
			this._playing=false;
			delete this._audio;
			this.updateplayer();
		},
		stopplayer:function() {
			this._audio.pause();
			try {this._audio.currentTime=0;} catch(e){} // If seeking is not supported
		},
		toggleplay:function(event) {
			if (this._audio) {
				if (this._playing) {
					this._playing=false;
					if (this._audio.pause) this.stopplayer();
				} else {
					if (this._offlineresource||widget.isonline()) {
						this._playing=true;
						widget.broadcastevent(this,"onmediastarting",{caller:this});
						if (this._audio.play) this._audio.play();
					} else widget.commonpassivepopup("disconnected");
				}
				this.updateplayer();
			}
		}
	}
}