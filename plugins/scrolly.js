// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A scrolling surface with some degree of customization. Must have a contained "div" that is the surface that will be scrolled.
 *  scrollhorizontal=yes Enables horizontal scrolling. Not set for disable horizontal scroll.
 *  scrollvertical=yes Enables vertical scrolling. Not set for disable vertical scroll.
 *  spring=horizontal|vertical Enables horizontal/vertical spring, snapping the inner container's elements. Not set for disable springing.
 */
browse._widgets.scrolly={
	global: {
		onpageprepare:function(event) { // When applying styles, just reset position if available
			var ctx=widget.getcontext(this);
			if (!ctx) { // Uses the context to save the scroll position. Is restored when going back to the current page.
				ctx={left:0,top:0};
				widget.setcontext(this,ctx);
			}
			this._centerx=0;
			this._centery=0;
			this._dragstart=false;
			this._child=this.getElementsByTagName('div')[0];
			this._springing=false;
			widget.applytouchevents(this,this.touchstart,this.touchmove,this.touchend);
			this.onpageshow();
		},
		onpageshow:function(event) { this.keepview(); },
		onpageresize:function() { this.onpageshow(); },
		keepcoord:function(ctx) {
			var width=this._child.clientWidth-this.offsetWidth;
			var height=this._child.offsetHeight-this.offsetHeight;			
			if (ctx.top<-height) ctx.top=-height;
			if (ctx.top>0) ctx.top=0;
			if (ctx.left<-width) ctx.left=-width;
			if (ctx.left>0) ctx.left=0;		
		},
		keepview:function() {
			var ctx=widget.getcontext(this);
			this.keepcoord(ctx);
			widget.displaceobject(this._child,ctx.left,ctx.top);		
		},
		isidle:function() { return !this._springing},
		// Touch
		touchstart:function(e) {
			if (e.touches.length != 1) return false;
			if (this.isidle()&&!this._dragstart) {
				this._centerx=e.touches[0].clientX;
				this._centery=e.touches[0].clientY;
				this._dragstart=true;
			}
		},
		touchmove:function(e) {
			e.preventDefault();
			if (e.touches.length != 1) return false;
			if (this.isidle()&&this._dragstart) {
				var ctx=widget.getcontext(this);			
				if (this.getAttribute('scrollhorizontal')) ctx.left+=e.touches[0].clientX-this._centerx;
				if (this.getAttribute('scrollvertical')) ctx.top+=e.touches[0].clientY-this._centery;
				this._centerx=e.touches[0].clientX;
				this._centery=e.touches[0].clientY;
				widget.displaceobject(this._child,ctx.left,ctx.top);
			}
		},
		touchend:function(e) {
			e.preventDefault();
			if (e.touches.length > 0) return false;
			if (this.isidle()) {
				this._dragstart=false;
				this._centerx=0;
				this._centery=0;
				
				var ctx=widget.getcontext(this);
				this._destination={left:ctx.left,top:ctx.top};
				this.keepcoord(this._destination);
				
				if (this.getAttribute('spring')) {
					var nextdestination=null;
					var dist=-1;
					var nd=0;
					for (var i=0;i<this._child.childNodes.length;i++) {
						var obj=this._child.childNodes[i];
						if (obj.offsetLeft!==undefined) {
							if (this.getAttribute('spring')=="horizontal") {
								nd=Math.abs(-this._destination.left-obj.offsetLeft);
								if ((dist==-1)||(nd<dist)) {
									nextdestination={left:-obj.offsetLeft,top:this._destination.top};
									dist=nd;
								}
							} else {
								nd=Math.abs(-this._destination.top-obj.offsetTop);
								if ((dist==-1)||(nd<dist)) {
									nextdestination={left:this._destination.left,top:-obj.offsetTop};
									dist=nd;
								}							
							}
						}
					}
					this._destination=nextdestination;
					this.keepcoord(this._destination);
				}
				this.startspringing();
			}
		},
		// Spring
		startspringing:function(th) {
			if (!this._springing) {
				this._springing=true;
				this.spring();
			}
		},
		spring:function() {
			var ctx=widget.getcontext(this);
			var gap=(this._destination.left-ctx.left)/2;
			var spc=0;
			if (Math.abs(gap)<=1) {
				ctx.left=this._destination.left;
				spc++;
			} else ctx.left+=gap;
			gap=(this._destination.top-ctx.top)/2;
			if (Math.abs(gap)<=1) {
				ctx.top=this._destination.top;
				spc++;
			} else ctx.top+=gap;
			if (spc==2) this._springing=false;
			widget.displaceobject(this._child,ctx.left,ctx.top);		
			if (this._springing) setTimeout(widget.launchon(this,this.spring),browse._settings.spring.time);
		},	
	}	
}
