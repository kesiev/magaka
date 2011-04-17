// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A very old school rotating bullet. Apply to any squared div.
 * Parameters:
 *  corners: number of the corners
 */
browse._widgets.bullet={
	global:{
		onpageprepare:function(event) {
			this._ang=0;
			this._angles=[];
			this._corners=this.getAttribute("corners");
			for (var i=0;i<this._corners;i++) {
				var node=this.cloneNode(false);
				node.innerHTML="";
				node.style.zIndex=1;
				this._angles.push(node);
				this.parentNode.appendChild(node);
			}
			this.style.zIndex=2;
			this.style.background=null;
			if (browse._hardware.transform) this.rotate();
		},
		onpageshow:function(event) {
			if (browse._hardware.transform) this._rotateschedule=widget.schedule(this,1,this,this.rotate,[]);
		},
		onpageleave:function(event) { // Set the front again
			if (browse._hardware.transform) widget.removeobjectschedules(this);
		},
		rotate:function() {
			this._ang=(this._ang+0.5)%360;
			for (var i=0;i<this._corners;i++) {
				var ang=this._angles[i];
				ang.style[browse._hardware.transform.js]="rotate("+(this._ang+(360/this._corners*i))+"deg)";
			}
		}
	}
}