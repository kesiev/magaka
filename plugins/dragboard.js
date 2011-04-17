// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * Your personal fridge board! Make all the "draggable=yes" objects draggable.
 */
 browse._widgets.dragboard={
	global:{
		onpageprepare:function(event) {
			this._fingers={};
			this._backup=[];
			for (var i=0;i<this.childNodes.length;i++)
				if (this.childNodes[i].getAttribute&&this.childNodes[i].getAttribute("draggable")) this._backup.push({obj:this.childNodes[i],left:this.childNodes[i].style.left,top:this.childNodes[i].style.top});
			this.onpageresize();
			widget.applytouchevents(this,this.touchstart,this.touchmove,this.touchend);			
		},
		onpageresize:function() {
			for (var i=0;i<this._backup.length;i++) {
				this._backup[i].obj.style.left=this._backup[i].left;
				this._backup[i].obj.style.top=this._backup[i].top;
			}
		},
		tapped:function() {
			if (this._taps==2) this.onpageresize();
			this._taps=0;
			return true; // Unschedule
		},
		addtap:function() {
			this._taps++;
			if (this._taptimer!=null) widget.removeschedule(this,this._taptimer); // Unschedule		
			this._taptimer=widget.schedule(this,browse._settings.taptime/4,this,this.tapped,[]); // Reschedule
		},
		canceltap:function() {
			this._taps=0;
			if (this._taptimer!=null) widget.removeschedule(this,this._taptimer); // Unschedule		
		},
		touchstart:function(e) {
			if (e.mouseWrapper) this._touches=true;
			if (e.touches.length==1) this.addtap(); else this.canceltap();
			for (var i=0;i<e.touches.length;i++) {
				var id=e.touches[i].identifier;
				if (!this._fingers[id]) {
					var touched=widget.touchedobject(this,e.touches[i],"draggable");
					this._fingers[id]={obj:touched,edge:(touched?{x:touched.style.left.replace(/[^0-9]*/g,"")*1,y:touched.style.top.replace(/[^0-9]*/g,"")*1}:null),center:{x:e.touches[i].clientX,y:e.touches[i].clientY}};
				}
			}
		},
		touchmove:function(e) {
			if ((this._touches&&e.mouseWrapper)||!e.mouseWrapper) {
				this.canceltap();
				for (var i=0;i<e.touches.length;i++) {
					var id=e.touches[i].identifier;
					if (this._fingers[id]&&this._fingers[id].obj) {
						var pos={x:e.touches[i].clientX,y:e.touches[i].clientY};
						this._fingers[id].edge.x+=pos.x-this._fingers[id].center.x;
						this._fingers[id].edge.y+=pos.y-this._fingers[id].center.y;
						this._fingers[id].obj.style.left=this._fingers[id].edge.x+"px";
						this._fingers[id].obj.style.top=this._fingers[id].edge.y+"px";
						this._fingers[id].center=pos;
					}
				}
			}
		},
		touchend:function(e) {
			if (e.mouseWrapper) {
				this._touches=false;
				this._fingers={};
			} else {
				var ids={}
				for (var i=0;i<e.touches.length;i++) ids[e.touches[i].identifier]=true;
				for (var i in this._fingers) if (!ids[i]) delete this._fingers[i];
			}
		}
	}
}