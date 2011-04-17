// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * The "over" page animation. Links the animation trigger on the related element.
 * Shows how to integrate JQuery in your magazine for making complex animations.
 */
 browse._widgets.over={
 	init:function() {
 		browse.loadjs("plugins/over-data/jquery.js");
 	},

	global:{
		// Your animation.
		beginanimation:function() {
			this._started=true;
			$(this.oid("trigger")).fadeTo(500,0,widget.launchon(this,function(){
				$(this.oid("trigger")).css({display:"none",left:"0px",top:"0px",width:"0px",height:"0px"});
				$(this.oid("backdrop")).animate( {width:"290px"},1000,"swing");
				$(this.oid("building1")).animate( {height:"200px"},1000,"swing");
				$(this.oid("building2")).animate( {height:"280px"},1000,"swing");
				$(this.oid("building3")).animate( {height:"250px"},1000,"swing");
				$(this.oid("building0")).delay(500).animate( {height:"350px"},1000,"swing");
				$(this.oid("arrow0")).delay(1500).animate( {width:"214px"},1000,"swing");
				$(this.oid("arrow1")).delay(1500).animate( {width:"159px"},1000,"swing");
				$(this.oid("arrow2")).delay(1500).animate( {width:"274px"},1000,"swing");
				$(this.oid("arrow3")).delay(1500).animate( {width:"109px"},1000,"swing");
				$(this.oid("arrow3")).delay(1500).animate( {width:"109px"},1000,"swing");
				$(this.oid("arrow4")).delay(1500).animate( {width:"274px"},1000,"swing");
				$(this.oid("arrow4")).delay(1500).animate( {width:"274px"},1000,"swing");
				$(this.oid("message")).animate( {bottom:"40px"},1000,"swing").delay(500).animate({width:"480px"},1000,"swing",widget.launchon(this,function(){
					$(this.oid("boxcontent")).slideDown( 1000);
					$(this.oid("text")).slideDown( 1000);
					this._started=false; // Restore the animation
				}));
			}));
		},
		// JQuery handling. Probably stopping all the animation and setting the "ending state" for
		// everything instead of trying pausing all of them is better.
		oid:function(th){return "#"+this.getAttribute('idprefix')+(th?"-"+th:"")},
		onpageprepare:function() {
			widget.applytouchevents(this,null,null,this.beginanimation);
		},
		onpagedrag:function() {
			if (this._started)
				$("#_current DIV").each(function(index,element){$(element).clearQueue();$(element).stop();});
		},
		onpagespring:function() {
			if (this._started) this.beginanimation();
		}
	}
}