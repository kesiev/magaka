// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * A page locker. Enable and disable the page drag lock.
 * Just apply the "pagelockerid='locked'" attribute for the page locked view and the "pagelockerid='unopen'" for the unlocked one.
 */
 browse._widgets.pagelocker={
	global:{
		onpageprepare:function(event) {
			widget.applytouchevents(this,null,null,this.togglelock);
			this.setlockimage();
		},
		setlockimage:function(id) {
			widget.getelementbyattribute(this,"pagelockerid","locked").style.display=(widget.getpagelock()?"block":"none");
			widget.getelementbyattribute(this,"pagelockerid","unlocked").style.display=(widget.getpagelock()?"none":"block");
		},
		togglelock:function() {
			widget.togglepagelock();
			this.setlockimage();
		}
	}
}