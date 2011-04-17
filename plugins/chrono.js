// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * CHRONO: a customizable animated stopwatch, used as full widget demo. A maximum value can be set
 *         as a tag attribute.
 *
 * Notes about events: the context of any of the events (the methods that are listed down and starts
 * with "on") has the applied object as context. I.E an:
 *
 * onpageshow:function() { alert(this.id) }
 *
 * on these two elements...
 *
 * <div widget='chrono' max='100' id='one'></div> <span widget='chrono' max='200' id='two'></span>
 *
 * will result as two alerts with two different values.
 *
 */
 
browse._widgets.chrono={
	init:function() {
		/*
		 * This method is called once when the plugin is loaded. We can load some stuff from the
		 * net or prepare complex structures.
		 */
	},
	/*
	 * Global part: all these methods are linked to the single instances of the object when is added
	 *              to the page, i.e. are callable with this.<method name> when the context is the
	 *              single object instance.
	 */	 
	global:{
		/*
		 * onpageprepare: this event is meant to be used for preparing an "hidden" page.
		 *                Elements are restored to their original position and/or events are set to
		 *                dynamic parts.
		 */
		onpageprepare:function(event) {
			if (this.childNodes.length==0) { // If this object is empty...
				// Let's create the default HTML
				var html="";
				html+="<div chronoelement='stop' style='position:absolute;left:0px;width:50px;height:100%;background-color:#dadada;float:left'>Stop</div>";
				html+="<div chronoelement='timer' style='position:absolute;left:50px;left:50px;width:50px;height:100%;background-color:#cecece;float:left'></div>";
				html+="<div chronoelement='event' style='position:absolute;left:100px;right:0px;height:100%;background-color:yellow;background-color:gray;float:left'></div>";
				this.innerHTML=html;
			}
			
			// Now we're making the button interactive."applytouchevents" will help you to automatically
			// create a mouse->touch proxy on your widget so you just need to implement the "touch"
			// events.
			widget.applytouchevents(
				widget.getelementbyattribute(this,"chronoelement","stop"), // The linked object
				null, // The ontouchstart event
				null, // The ontouchmove event
				widget.launchon(this,browse._widgets.chrono.stop) // The ontouchup event
				// We're going to trigger the "stop" method on this hinstance of the widget on touch.
			);
			
			// We're going to reset the timer too to 0
			widget.getelementbyattribute(this,"chronoelement","timer").innerHTML="0";		
			
			// Now the page is ready to be shown.
		},
		
		/*
		 * onpageshow: this event is triggered when a page became visible, after a pan or a modal is
		 *             shown. Usually animations starts here, instead of on the "onprepare" event.
		 *             Also, starting from the "onpageshow" event, the page scheduler is available for
		 *             scheduled calls.
		 */
		onpageshow:function(event) {
			// We will start two schedules for two distinct animation. One for the time, scheduled
			// each 1000 ms (every second) that will call, on "this" instance of the widget the
			// "counter" method with two generical arguments.
			this._counterschedule=widget.schedule(this,100,this,browse._widgets.chrono.counter,["arg1","arg2"]);
			// Note that "this" is the current instance of the widget. Every instance will store a different
			// schedule for its "counter" event.
			
			// We will start another schedule, that will blink the timer color. Just for showing multiple
			// schedules. Is triggered every half second
			this._blinkschedule=widget.schedule(this,20,this,browse._widgets.chrono.blink,[]);
			// Schedules are automatically paused in many cases, like during the page drag.
			
			// We're also going to add a boolean to our widget instance for creating the blink effect...
			this._blinkon=true;
			// Will be negated every time, so we will have a cycling true/false set of values. As you've
			// understand, object instances can store any type of local variable. Handy, huh?
			
		},
		
		/*
		 * onpageleave: this event is triggered when a page is leaving the main view.
		 *              Is usually used for stopping animation and restore everything to the initial
		 *              state - that is the same thing that is done by onpageprepare.
		 *             scheduled calls.
		 */
		onpageleave:function(event) { // Set the front again
			widget.removeobjectschedules(this); // Remove all the schedules on this object (animation and timer)
			this.onpageprepare(); // Roll back to the "onpageprepare" state (counter is zeroed)
		},
		
		/*
		 * onevent: is triggered regardless the type of event. Can be used as debug.
		 */
		onevent:function(event) {
			// Just debug the triggered event name on its div, if exists.
			var box=widget.getelementbyattribute(this,"chronoelement","event");
			if (box) box.innerHTML=event.event;
		}
	},
	
	/*
	 * We're out from "global", so these are "widget type" classes. Are not linked to the single
	 * objects of "chrono" type.
	 */
	
	/*
	 * Now these are our widget's custom method. Are not directly mapped into the widget instance
	 * but are available for direct calls using browse._widgets.chrono.<namemethod>(), for using
	 * them as scheduled operations or to be "launched on" this widget instance.
	 */
	counter:function(arg1,arg2) {
		// arg1 and arg2 are valued accordingly, as defined in the _timer. Seeing is beliving, so uncomment
		// this console.log :)
		// console.log(arg1,arg2);
		
		// First of all, let's pick the original value.
		var cnt=widget.getelementbyattribute(this,"chronoelement","timer").innerHTML*1; // *1 for converting in number
		// Notes that you can store in "this" the object references instead of using "getelementbyattribute"
		// every time. This speeds up the things very much!
		
		cnt++; // Increasing the counter...
		
		widget.getelementbyattribute(this,"chronoelement","timer").innerHTML=cnt; // ...and set back to the counter
		
		// If the counter reaches the "max" value, "true" is returned. If a scheduled function returns
		// "true" is automatically removed from the scheduler, so the count stops.
		if (cnt==this.getAttribute("max")*1) return true;
		
	},
	
	blink:function() {
		// Swithcing on and off the timer.
		this._blinkon=!this._blinkon;
		
		// And changing the color :)
		widget.getelementbyattribute(this,"chronoelement","timer").style.color=(this._blinkon?"black":"white");
	},
	
	stop:function() {
		// Stopping the timer. Will be done removing from the scheduler the _counterschedule.
		widget.removeschedule(this,this._counterschedule);
		// Notes that the timer will keep blinking, since the _blinkschedule is still running.
	}

}
