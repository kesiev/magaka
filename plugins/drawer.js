// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A simple drawer object. Shows the "closed" drawer as default and switches to the opened one as a toggle.
 * Just apply the "drawerid='close'" attribute to the closed drawer tag and the "drawerid='open'" for the opened one.
 * It also triggers the "pagesizechanged" method, so can be used on scrolling page
 */
 browse._widgets.drawer={
	global:{
		onpageprepare:function(event) {
			this._drawers={};
			this._currentdrawer
			for (var i=0;i<this.childNodes.length;i++)
				if (this.childNodes[i].getAttribute&&this.childNodes[i].getAttribute("drawerid")) this._drawers[this.childNodes[i].getAttribute("drawerid")]=this.childNodes[i];
			widget.applytouchevents(this,null,null,this.toggledrawer);
			this.setdrawerpage("close");
		},
		setdrawerpage:function(id) {
			for (var a in this._drawers)
				this._drawers[a].style.display=(a==id?"block":"none");
			this._drawerstate=id;
			widget.pagesizechanged(); // Adjust the page length after the object resize.
		},
		toggledrawer:function() {
			this.setdrawerpage((this._drawerstate=="close"?"open":"close"));
		}
	}
}