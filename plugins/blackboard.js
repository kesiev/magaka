// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * Make everything a drawable canvas :)
 * Parameters:
 *  canvascolor: color of the background. "clear" for clear.
 *  pencolor: color of the pen. "clear" for clear.
 *  pensize: size of the pen
 *
 *  use "canvascolor=gray pencolor=clear" for scratch to win! ;)
 */
 browse._widgets.blackboard={
	global:{
		onpageprepare:function(event) {
			this._canvas=document.createElement("canvas");
			this._canvas.style.position="absolute";
			this._canvas.style.left="0px";
			this._canvas.style.top="0px";
			this._canvas.style.zIndex=10;
			this._touches=0;
			this._taps=0;
			this._taptimer=null;
			widget.applytouchevents(this,this.touchstart,this.touchmove,this.touchend);
			this._fingers={};
			this.appendChild(this._canvas);
			if (this.getAttribute("fullscreen")) { // Detect if the widget is show in fullscreen
				var closer=widget.makediv({rx:"20px",y:"20px",w:"50px",h:"50px",css:{zIndex:20,backgroundImage:"url('libs/closebutton.png')"}},this);
				widget.applytouchevents(closer,null,null,function(){widget.hidemodal()});
			}
			this.onpageresize();
		},
		onpageshow:function() {
			this.onpageresize();
		},
		onpageleave:function() {
			this.onpageresize();
		},
		onpageresize:function() {
			var ctx=this._canvas.getContext('2d');
			this._canvas.height=this.offsetHeight;
			this._canvas.width=this.offsetWidth;
			ctx.lineWidth = (this.getAttribute("pensize")?this.getAttribute("pensize")*1:4);
			ctx.globalCompositeOperation = "source-over";
			var bgcolor=(this.getAttribute("canvascolor")?this.getAttribute("canvascolor"):"white");
			var fgcolor=(this.getAttribute("pencolor")?this.getAttribute("pencolor"):"black");
			if (bgcolor=="clear") bgcolor="rgba(0,0,0,0)";
			ctx.strokeStyle = bgcolor;
			ctx.fillStyle   = bgcolor;
			ctx.fillRect  (0,   0, this._canvas.width, this._canvas.height);
			if (fgcolor=="clear") { fgcolor="rgba(255,255,255)"; ctx.globalCompositeOperation = "destination-out"; }
			ctx.strokeStyle = fgcolor;			
			ctx.fillStyle   = fgcolor;
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
		},
		touchmove:function(e) {
			if ((this._touches&&e.mouseWrapper)||!e.mouseWrapper) {
				this.canceltap();
				var ctx=this._canvas.getContext('2d');
				var newfingers={};
				for (var i=0;i<e.touches.length;i++) {
					var id=e.touches[i].identifier;
					var newfinger={x:e.touches[i].clientX,y:e.touches[i].clientY};
					if (this._fingers[id]) {
						ctx.beginPath();						
						ctx.moveTo(this._fingers[id].x-this.offsetLeft, this._fingers[id].y-this.offsetTop);
						ctx.lineTo(newfinger.x-this.offsetLeft, newfinger.y-this.offsetTop);
						ctx.stroke();
						ctx.closePath();
					}
					newfingers[id]=newfinger;
				}
				this._fingers=newfingers;
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