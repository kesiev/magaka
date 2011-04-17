// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A mappable unlimited image. Usually used as... confusing index. :1
 * The configuration is provided from the content of the tag (?!). Put a JSON structure in your
 * tag like this:
 *
 * {
 *   w:<width of the image>,
 *   h:<height of the image>,
 *   img:<url of the image>,
 *   squares:[ // The list of clickable areas
 *     {x:<x coord of the area>,
 *      y:<y coord of the area>,
 *      w:<width of the area>,
 *      h:<height of the area>,
 *      action:function(){ <action performed> } // return true to keep the modal (if any) opened after the click
 *     },
 *     ...
 *   ]
 * }
 *
 */
browse._widgets.infiniboard={
	global:{
		onpageprepare:function(event) {
		
			this._config=eval("("+this.innerHTML+")");
			this.innerHTML="";
			this.style.backgroundImage="url('"+this._config.img+"')";
			this._scroll={x:0,y:0,accx:0,accy:0};
			
			widget.applytouchevents(this,this.touchstart,this.touchmove,this.touchend);

			if (this.getAttribute("fullscreen")) { // Detect if the widget is show in fullscreen
				var closer=widget.makediv({rx:"20px",y:"20px",w:"50px",h:"50px",css:{zIndex:20,backgroundImage:"url('libs/closebutton.png')"}},this);
				widget.applytouchevents(closer,null,null,function(){widget.hidemodal()});
			}
		},
		stopspring:function() {
			this._scroll.accx=0;
			this._scroll.accy=0;
			this._springing=false;
			if (this._spring) {
				clearTimeout(this._spring);
				this._spring=null;
				return true;
			} else return false;
		},
		drawframe:function() {
			if (this._scroll.x<0) this._scroll.x=this._config.w+this._scroll.x;
			if (this._scroll.x>this._config.w) this._scroll.x=this._scroll.x-this._config.w;
			if (this._scroll.y<0) this._scroll.y=this._config.h+this._scroll.y;
			if (this._scroll.y>this._config.h) this._scroll.y=this._scroll.y-this._config.h;
			this.style.backgroundPosition=this._scroll.x+"px "+this._scroll.y+"px";
		},
		touchstart:function(e) {
			if (e.touches.length != 1) return false;
			if (!this._dragstart) {
				this._scroll.tapping=!this.stopspring();
				this._centerx=e.touches[0].clientX;
				this._centery=e.touches[0].clientY;
				this._dragstart=true;
			}
		},
		touchmove:function(e) {
			e.preventDefault();
			if (e.touches.length != 1) return false;
			if (this._dragstart) {
				var ctx=widget.getcontext(this);
				this._scroll.tapping=false;
				this._scroll.accx=e.touches[0].clientX-this._centerx;
				this._scroll.accy=e.touches[0].clientY-this._centery;
				this._scroll.x+=this._scroll.accx;
				this._scroll.y+=this._scroll.accy;
				this._centerx=e.touches[0].clientX;
				this._centery=e.touches[0].clientY;
				this.drawframe();
			}
		},
		touchend:function(e) {
			e.preventDefault();
			if (e.touches.length > 0) return false;
			this._dragstart=false;
			if (this._scroll.tapping) {
				this.stopspring();
				var o1={x:(this._centerx-this.offsetLeft-this._scroll.x+this._config.w)%this._config.w,y:(this._centery-this.offsetTop-this._scroll.y+this._config.h)%this._config.h};
				for (var i=0;i<this._config.squares.length;i++) {
					var sq=this._config.squares[i];
					if (!((o1.y<sq.y) || (o1.y> sq.y+sq.h-1) || (o1.x<sq.x) || (o1.x>sq.x+sq.w-1))) {
						if (!sq.action()) widget.hidemodal();
						break;
					}
				}
			} else {
				this._centerx=0;
				this._centery=0;
				this.startspring();
			}
		},
		startspring:function() {
			if (!this._springing) {
				this.springing=true;
				this.spring();
			}
		},
		spring:function() {
			this._scroll.x+=this._scroll.accx;
			this._scroll.y+=this._scroll.accy;
			this._scroll.accx=this._scroll.accx/1.01;
			this._scroll.accy=this._scroll.accy/1.01;
			if (Math.abs(this._scroll.accx)<1) this._scroll.accx=0; 
			if (Math.abs(this._scroll.accy)<1) this._scroll.accy=0;
			this.drawframe();
			if (!this._scroll.accx&&!this._scroll.accy) 
				this.stopspring();
			else
				this._spring=setTimeout(widget.launchon(this,this.spring),50);
		}
	}
}
