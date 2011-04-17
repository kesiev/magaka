// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * Show and hide the backward side of a rectangle. Just create 2 DIVS inside the widget: the first
 * one will be the front and the second one the back. Tap on the widget to flip front/back.
 */
browse._widgets.flipper={
	init:function(){
		browse.addcss("plugins/flipper.css");
	},
	global:{
		onpageprepare:function(event) {
			this._container=this.getElementsByTagName('div')[0];
			widget.applytouchevents(this._container,null,null,widget.launchon(this,this.flip));
			
			var faces=this._container.getElementsByTagName('div');
			this._front=faces[0];
			this._back=faces[1];
			this._frontclassname=this._front.className;
			this._backclassname=this._back.className;
			
			if (browse._hardware.transitionproperty&&browse._hardware.backfacevisibility) {
				this.className="flip-container";
				this._front.className=this._frontclassname+" flip-card-front flip-card-face";
				this._back.className=this._backclassname+" flip-card-back flip-card-face";
			}
			this.resetwidget();
			
		},
		onpageleave:function(event) { // Set the front again
			this.resetwidget();
		},
		resetwidget:function() {
			this._flipped=false;
			if (browse._hardware.transitionproperty&&browse._hardware.backfacevisibility) {
				this._container.className="flip-card-fixed";
			} else {
				this._front.className=this._frontclassname+" compat-front compat-face";
				this._back.className=this._backclassname+" compat-back compat-face";			
			}
		},
		flip:function(event) {
			this._flipped=!this._flipped;
			if (browse._hardware.transitionproperty&&browse._hardware.backfacevisibility)
				this._container.className=(this._flipped?'flip-card flipped':'flip-card');
			else {
				this._front.className=this._frontclassname+(this._flipped?" compat-back":" compat-front")+" compat-face";
				this._back.className=this._backclassname+(this._flipped?" compat-front":" compat-back")+" compat-face";		
			}
		}
	}
}