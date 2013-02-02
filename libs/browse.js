// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
var browse={

	_settings:{
		toolname:"Magaka",
		toollicense:"MIT/GPL",
		skipdelays:false, // Turn on with skipdelay=yes
		tool:null, // NULL for the browser. set with tool=xxx. Use tool=help for help.
		enabletools:true, // Set false for disabling tools.
		nowidgets:false, // Enable/disable widgets on page
		taptime:300,
		debug:0, // 0: disabled, 1: file operations only
		uselocalstorage:true, // Uses the HTML5 offline storage for local magazine settings if available
		enablepassivepopups:true, // Enables the passive popup. Disable it when you need to rasterize the page.
		recordloading:{enabled:false, recursive:false}, // Record the loaded resources on the "recorder" object.
		passivepopups:{
			offlinestorageonline:{
				cached:{id:"cached",text:"Magazine downloaded.",style:{backgroundColor:"#ccff82",color:"#000000"}},
				checking:{id:"checking",text:"Checking...",style:{backgroundColor:"#ffee7c",color:"#000000"}},
				downloading:{id:"downloading",text:"Downloading...",style:{backgroundColor:"#ffee7c",color:"#000000"}},
				error:{id:"error",text:"Can't download magazine.<br>If you've increased the offline<br>storage space, try closing your<br>browser <b>(from background too)</b> and<br>open again this page.",style:{backgroundColor:"#ffb2b2",color:"#000000"},time:10000},
				// Only the bookmarklet mode can restore the cache refreshing the page. Probably is some kind of safari bug.
				errorbm:{id:"error",text:"Can't download magazine.<br>If you've increased the offline<br>storage space, please try <b>reopening<br>this bookmarklet</b>.",style:{backgroundColor:"#ffb2b2",color:"#000000"},time:10000},
				noupdate:{id:"noupdate",text:"Magazine downloaded.",style:{backgroundColor:"#ccff82",color:"#000000"}},
				obsolete:{id:"obsolete",text:"Old magazine found",style:{backgroundColor:"#ffee7c",color:"#000000"}},
				progress:{id:"progress",text:"Downloading...",style:{backgroundColor:"#ffee7c",color:"#000000"}},
				updateready:{id:"updateready",text:"Updated. Reloading...",onshow:function(){browse.reloadmagazine()},style:{backgroundColor:"#ffcfac",color:"#000000"}}
			},
			offlinestorageoffline:{
				checking:{id:"checking",text:"Checking...",style:{backgroundColor:"#ffee7c",color:"#000000"}},
				noupdate:{id:"noupdate",text:"Magazine downloaded.",style:{backgroundColor:"#ccff82",color:"#000000"}},
				error:{id:"noupdate",text:"Magazine downloaded.",style:{backgroundColor:"#ccff82",color:"#000000"}},
			},
			common:{
				disconnected:{id:"noonline",text:"Can't access this content since your device is <b>offline</b>.<br>Please make sure to be connected to internet<br>in order to access this content.",style:{backgroundColor:"#ffee7c",color:"#000000"},time:5000},
				nogeolocation:{id:"nogeo",text:"Can't access to your <b>GPS position</b>.<br>Please make sure that the geolocation services<br>of your devices are enabled for this site.",style:{backgroundColor:"#ffee7c",color:"#000000"},time:5000},
			},
			boxmaker:{
				ready:{id:"boxmakerready",text:"Boxmaker tool ready.<br>Call this page with the<br><b>tool=boxmakerhelp</b> parameter<br>for a the guide or press H<br>for a quick help.",style:{backgroundColor:"#ffa0a0",color:"#000000"}},
				add:{id:"boxmakeradd",text:"Boxmaker in <b>add mode</b>.<br>Draw a box on the page to<br>add a sensible are.",style:{backgroundColor:"#ffa0a0",color:"#000000"}},
				browse:{id:"boxmakerunbrowse",text:"Boxmaker in <b>browse mode</b>.<br>You can now navigate the magazine.",style:{backgroundColor:"#ffa0a0",color:"#000000"}},
				dragging:{id:"boxmakerdragging",text:"Please end creating a box.",style:{backgroundColor:"#ffa0a0",color:"#000000"}},
				save:{id:"boxmakersave",keep:true,text:"Boxmaker <b>is entering in save mode</b>.<br><br>Make sure that <b>all the boxes<br>you need has been created</b> and<br>hit the S key again.<br><br>For now, the created boxes <b>cannot<br>be imported and edited again with<br>the boxmaker tool</b> so make sure<br>that your work is done.<br><br>Press any other key to cancel.",style:{backgroundColor:"#ffa0a0",color:"#000000"}},
				quickhelp:{id:"boxmakerhelp",text:"<b>Boxmaker quick help</b><br><br>B: browse pages<br>A: add box<br>E: edit added boxes<br><br>S: save mode.",style:{backgroundColor:"#ffa0a0",color:"#000000"}}
			}
		},
		loadingscreen:{
			delay:20
		},
		modal:{
			delay:0
		},
		spring:{
			time:30,
			sensitivity:50,
			dragthreshold:3
		},
		thumbnailer:{
			originalwidth:1024,
			originalheight:768,
			scale:0.625
		},
		devices:[
			{landscape:{width:1024,height:748},portrait:{width:768,height:1004},label:"iPad, bookmarlet (full screen)"}
		]
	},
	_boxmaker:{enabled:false,editing:0,currentcenter:null,currentbox:null,currentrect:null,boxeditor:{bg:null,boxes:[],currentdata:null},data:{}},
	_recorder:{css:[],plugin:[],js:[]},
	_firstpage:{obj:null,pageprefix:null,pageid:null,page:null,shown:false,schedules:[],gc:[],x:0,y:0,sum:0,hotspots:[],classname:"scroller"},
	_currentpage:{obj:null,pageprefix:null,pageid:null,page:null,shown:false,schedules:[],gc:[],x:0,y:0,sum:0,hotspots:[],classname:"scroller"},
	_nextpage:{obj:null,pageprefix:null,pageid:null,page:null,shown:false,schedules:[],gc:[],x:0,y:0,sum:0,hotspots:[],classname:"scroller"},
	_upperpage:{obj:null,pageprefix:null,pageid:null,page:null,shown:false,schedules:[],gc:[],x:0,y:0,sum:0,hotspots:[],classname:"scroller"},
	_lowerpage:{obj:null,pageprefix:null,pageid:null,page:null,shown:false,schedules:[],gc:[],x:0,y:0,sum:0,hotspots:[],classname:"scroller"},

	_modalbox:{obj:null,pageprefix:null,pageid:null,page:null,schedules:[],gc:[],hotspots:[],classname:"modal",ypos:1,delay:0,shown:false,displayed:false,animating:false,originalpage:null},
	
	_shadowbox:{h:null,v:null},
	
	_scheduler:{gc:[],timer:null,paused:true},
	
	_pagestack:{stack:[],topmostpage:null},
	_loadingscreen:{obj:null,time:0},
	
	_display:null,
	_width:null,
	_height:null,
	_xscroll:0,
	_yscroll:0,
	_baseyscroll:0,
	_scrollside:0,
	_dragstart:null,
	_dragidentifier:null,
	_centerx:0,
	_centery:0,
	_springing:false,
	_bulletbox:null,
	_scrollbar:null,
	_vscrollbar:null,
	_scrollbartime:0,
	_taps:0,
	_taptimer:null,
	_gui:null,
	_passivepopup:{obj:null,state:null},
	_extrabar:null,
	_guishown:false,
	_animatinggui:false,
	_guicounter:-1,
	_hardware:{},
	
	_widgets:{},
	
	_widgetdata:{},
	_webcache:{},
	_loadedfiles:{},
	
	_loader:{one:{},two:{},current:null},
	_magazine:{bundlefile:"issue.js"}, // The default file name for the bundle main file
	
	// Navigation
	
	_loaded:0,
	_toload:0,
	
	_loadphase:0,
	_travel:null,
	_locked:false,

	_applypagequeue:{busy:false,queue:[]},
	
	// *********************
	// MOVEMENT PART
	// *********************
	
	// ---
	// Main navigator - Raw events
	// ---
	// Mouse -> Touch	
	applytouchevents:function(dest,touchstart,touchmove,touchend,dontcheck) {
		if (dontcheck) {
			if (!browse._hardware.touchenabled) { // Enable the virtual touch if is not a touch interface.
				if (touchstart) browse.addEventListener(dest,"mousedown",function(e){e.touches=[{identifier:1,clientX:e.pageX,clientY:e.pageY}];e.mouseWrapper=true;if (this.ontouchstart) this.ontouchstart(e);});
				if (touchmove) browse.addEventListener(dest,"mousemove",function(e){e.stopPropagation(); if (this.ontouchmove) {e.touches=[{identifier:1,clientX:e.pageX,clientY:e.pageY}];e.mouseWrapper=true;this.ontouchmove(e);}});
				if (touchend) browse.addEventListener(dest,"mouseup",function(e){e.stopPropagation();if(this.ontouchend){e.touches=[];e.mouseWrapper=true;this.ontouchend(e);}});
			}
			dest.ontouchstart=touchstart;
			dest.ontouchmove=touchmove;
			dest.ontouchend=touchend;
			dest.ontouchcancel=touchend;
		} else {
			if (!browse._hardware.touchenabled) { // Enable the virtual touch if is not a touch interface.
				if (touchstart) browse.addEventListener(dest,"mousedown",function(e){if (!browse.isbrowseridle()) return; e.touches=[{identifier:1,clientX:e.pageX,clientY:e.pageY}];e.mouseWrapper=true;if (this.ontouchstart) this.ontouchstart(e);});
				if (touchmove) browse.addEventListener(dest,"mousemove",function(e){if (!browse.isbrowseridle()) return; e.stopPropagation(); if (this.ontouchmove) {e.touches=[{identifier:1,clientX:e.pageX,clientY:e.pageY}];e.mouseWrapper=true;this.ontouchmove(e);}});
				if (touchend) browse.addEventListener(dest,"mouseup",function(e){if (!browse.isbrowseridle()) return; e.stopPropagation();if(this.ontouchend){e.touches=[];e.mouseWrapper=true;this.ontouchend(e);}});
			}
			dest.ontouchstart=function() { if (browse.isbrowseridle()) return touchstart.apply(this,arguments); }
			dest.ontouchmove=function() { if (browse.isbrowseridle()) return touchmove.apply(this,arguments); }
			dest.ontouchend=function() { if (browse.isbrowseridle()) return touchend.apply(this,arguments); }
			dest.ontouchcancel=function() { if (browse.isbrowseridle()) return touchend.apply(this,arguments); }
		}
	},
	// Touch
	__touchstart:function(e) {
		switch (browse._boxmaker.editing) {
			case 0:{
				if (!browse.pointisinteractive(e.touches[0].clientX,e.touches[0].clientY)) {
					if ((browse._pagestack.topmostpage==browse._currentpage)&&browse.isbrowseridle()&&(!browse._dragstart)&&!browse._locked) {
						browse.__startdragging();
						browse._centerx=e.touches[0].clientX;
						browse._centery=e.touches[0].clientY;
						browse._dragstart=true;
						browse._dragidentifier=e.touches[0].identifier;
					}
				} else return false;
				break;
			}
			case 1: { // Add mode
				if (!browse._boxmaker.currentrect) {
					browse._boxmaker.currentcenter={x:e.touches[0].clientX,y:e.touches[0].clientY};
					browse._boxmaker.currentrect={x:browse._boxmaker.currentcenter.x,y:browse._boxmaker.currentcenter.y,w:1,h:1};
					browse._boxmaker.currentbox=document.createElement("div");
					browse._boxmaker.currentbox.style.position="absolute";
					browse._boxmaker.currentbox.style.zIndex=999999;
					browse._boxmaker.currentbox.style.backgroundColor="#000000";
					browse._boxmaker.currentbox.style.opacity=0.5;
					browse._boxmaker.currentbox.style.border="1px dashed #ff0000";
					browse._boxmaker.currentbox.style.left=browse._boxmaker.currentrect.x+"px";
					browse._boxmaker.currentbox.style.top=browse._boxmaker.currentrect.y+"px";
					browse.applytouchevents(browse._boxmaker.currentbox,browse.__touchstart,browse.__touchmove,browse.__touchend,true);
					document.body.appendChild(browse._boxmaker.currentbox);
				}
				return false;
				break;
			}
			case 2: { // Edit (delete) mode
				if (browse._boxmaker.boxeditor.currentdata)
					for (var a=0;a<browse._boxmaker.boxeditor.currentdata.length;a++)
						if (!((e.touches[0].clientY<browse._boxmaker.boxeditor.currentdata[a].y) || (e.touches[0].clientY>browse._boxmaker.boxeditor.currentdata[a].y+browse._boxmaker.boxeditor.currentdata[a].h-1) || (e.touches[0].clientX<browse._boxmaker.boxeditor.currentdata[a].x) || (e.touches[0].clientX>browse._boxmaker.boxeditor.currentdata[a].x+browse._boxmaker.boxeditor.currentdata[a].w-1))) {
							browse.boxmakerdeletebox(a);
							break;
						}
				return false;
				break;
			}			
			default: { return false; }
		}
	},
	__touchmove:function(e) {
		e.preventDefault();
		switch (browse._boxmaker.editing) {
			case 0:{
				if (browse.isbrowseridle())
					for (var i=0;i<e.touches.length;i++) {
						if (browse._dragidentifier==e.touches[i].identifier) {
							var gapx=e.touches[i].clientX-browse._centerx;
							var gapy=e.touches[i].clientY-browse._centery;
							if (browse._scrollside==0)
								if ((Math.abs(gapx)>=browse._settings.spring.dragthreshold)||(Math.abs(gapy)>=browse._settings.spring.dragthreshold)) {
									browse._scrollside=(Math.abs(gapx)>Math.abs(gapy)?1:2);
									browse.showshadows(); // Enable shadows since we're dragging the page (in travel mode is not needed)
								}
							if (browse._scrollside==1)
								browse._xscroll=gapx;
							else if (browse._scrollside==2)
								browse._yscroll=gapy;
							else
								return;
							browse.layoutpages(); // Make the scroll happen
						}
					}
				break;
			}		
			case 1: { // Add mode
				if (browse._boxmaker.currentrect) {
					var w=e.touches[0].clientX-browse._boxmaker.currentcenter.x;
					var h=e.touches[0].clientY-browse._boxmaker.currentcenter.y;
					
					browse._boxmaker.currentrect.x=(w>0?browse._boxmaker.currentcenter.x:browse._boxmaker.currentcenter.x+w);
					browse._boxmaker.currentrect.y=(h>0?browse._boxmaker.currentcenter.y:browse._boxmaker.currentcenter.y+h);
					browse._boxmaker.currentrect.w=Math.abs(w);
					browse._boxmaker.currentrect.h=Math.abs(h);
					
					browse._boxmaker.currentbox.style.left=browse._boxmaker.currentrect.x+"px";
					browse._boxmaker.currentbox.style.top=browse._boxmaker.currentrect.y+"px";
					browse._boxmaker.currentbox.style.width=(browse._boxmaker.currentrect.w>2?browse._boxmaker.currentrect.w-2:1)+"px";
					browse._boxmaker.currentbox.style.height=(browse._boxmaker.currentrect.h>2?browse._boxmaker.currentrect.h-2:1)+"px";
				}
				return false;
				break;
			}
			default: { return false; }
		}
	},
	__touchend:function(e) {
		e.preventDefault();
		switch (browse._boxmaker.editing) {
			case 0:{
				if (browse.isbrowseridle()&&browse._dragstart) {
					if (browse._scrollside==0) browse.__addtap();	
					browse._dragstart=null;
					browse._dragidentifier=null;
					browse.__enddragging();
					browse.__startspringing();
					this._centerx=0;
					this._centery=0;
				}
				break;
			}
			case 1: { // Add mode
				if (browse._boxmaker.currentrect) {
					if (browse._boxmaker.currentrect.w>1&&browse._boxmaker.currentrect.h>1)
						browse.boxmakeraddbox(browse._boxmaker.currentrect);
					browse._boxmaker.currentrect=null;
					document.body.removeChild(browse._boxmaker.currentbox);
					delete browse._boxmaker.currentbox;
				}
				return false;
				break;
			}
		}
	},
	
	// ---
	// Spring behaviour
	// ---
	dospring:function() {
		this._springing=true;
		var gap=0;
		var reset=false;
		if (browse._scrollside==0)
			browse._springing=false;
		else if (browse._scrollside==1) {
			if (browse._current.hasnextpage&&(browse._xscroll<-browse._settings.spring.sensitivity)) { 
				gap=-((browse._width+browse._xscroll)/2);
				if (Math.abs(gap)<=1) {
					gap=0;
					browse._springing=false;
					browse.__switchtonext();
				}
			} else if (browse._current.hasprevpage&&(browse._xscroll>browse._settings.spring.sensitivity)) {
				gap=(browse._width-browse._xscroll)/2;
				if (gap<=1) {
					gap=0;
					browse._springing=false;
					browse.__switchtoprevious();
				}
			} else
				reset=true;
			if (reset) {
				browse._xscroll=(browse._xscroll/2);
				if (Math.abs(browse._xscroll)<=1) {
					browse._xscroll=0;
					browse._springing=false;
				}
			} else if (gap) browse._xscroll+=gap;
		} else {
			if (browse._current.pagedata&&browse._current.pagedata.scrollpage) {
				if (browse._baseyscroll+browse._yscroll>0) {
					reset=true;
					this._yscroll+=browse._baseyscroll;
					browse._baseyscroll=0;
				} else if (-browse._yscroll-browse._baseyscroll+browse._height>browse._currentpage.obj.offsetHeight) { 
					gap=((-browse._yscroll-browse._baseyscroll+browse._height-browse._currentpage.obj.offsetHeight)/2);
					if (Math.abs(gap)<=1) {
						gap=0;
						browse._springing=false;
						browse._baseyscroll=-browse._currentpage.obj.offsetHeight+browse._height;
						browse._yscroll=0;
					}
				} else {
					browse._baseyscroll+=browse._yscroll;
					browse._yscroll=0;
					browse._springing=false;
				}
			} else {
				if (browse._current.haslowerpage&&(browse._yscroll<-browse._settings.spring.sensitivity)) { 
					gap=-((browse._height+browse._yscroll)/2);
					if (Math.abs(gap)<=1) {
						gap=0;
						browse._springing=false;
						browse.__switchtolower();
					}
				} else if (browse._current.hasupperpage&&(browse._yscroll>browse._settings.spring.sensitivity)) {
					gap=(browse._height-browse._yscroll)/2;
					if (gap<=1) {
						gap=0;
						browse._springing=false;
						browse.__switchtoupper();
					}
				} else
					reset=true;
			}
			if (reset) {
				browse._yscroll=(browse._yscroll/2);
				if (Math.abs(browse._yscroll)<=1) {
					browse._yscroll=0;
					browse._springing=false;
				}
			} else if (gap) {
				browse._yscroll+=gap;
			}		
		}		
		if (browse._springing) {
			browse.layoutpages(); // Layout the springing page
			setTimeout(browse.dospring,browse._settings.spring.time);
		} else browse.__endspringing();
	},	
	
	// ---
	// Pseudo-raw events
	// ---
	__endtap:function() {
		if (browse.isbrowseridle()) {
			if (browse._taps==2)
				if (browse._current.magazineversion.metadata.ondoubletap)
					browse._current.magazineversion.metadata.ondoubletap(); // Alternative action on double tap
				else
					browse.togglegui(); // Toggle the gui as command
		}
		browse._taps=0;
	},
	__addtap:function() {
		browse._taps++;
		if (browse._taptimer) clearTimeout(browse._taptimer);
		browse._taptimer=setTimeout(browse.__endtap,browse._settings.taptime);
	},	
	__startdragging:function() {
		this.broadcastevent(this._currentpage,"onpagedrag"); // Broadcast a signal on start drag
		browse.pausescheduler(); // Pause the scheduler while dragging	
	},
	__enddragging:function() {
		this.broadcastevent(this._currentpage,"onpagedrop"); // Broadcast a signal on end drag
	},
	__startspringing:function() {
		if (!this._springing) this.dospring(); // Start springing if is not already springing
	},
	__endspringing:function() {
		browse._yscroll=0;
		browse._xscroll=0;
		browse._scrollside=0;
		browse._springing=false;
		browse.hideshadows(); // Disable shadows since we're surely on a full-page screen.
		browse.startscheduler(); // Restart the scheduler after dragging (if the page didn't changed)
		browse.layoutpages(); // Reset the pages position after springing as last step
		this.broadcastevent(this._currentpage,"onpagespring"); // Broadcast a signal on end drag
	},
	__switchtonext:function() {
		var tmp;
		this.leavepage(0); // Leave from the current page
		tmp=this._firstpage;
		this._firstpage=this._currentpage;
		this._currentpage=this._nextpage;
		this._nextpage=tmp;
		this.gotohorizontal(this._current.horizontal+1);
		this.pagechanged();
	},
	__switchtolower:function() {
		var tmp;
		this.leavepage(0); // Leave from the current page
		tmp=this._upperpage;
		this._upperpage=this._currentpage;
		this._currentpage=this._lowerpage;
		this._lowerpage=tmp;
		this.gotovertical(this._current.vertical+1);
		this.pagechanged();
	},
	__switchtoprevious:function() {
		var tmp;
		this.leavepage(0); // Leave from the current page
		tmp=this._nextpage;
		this._nextpage=this._currentpage;
		this._currentpage=this._firstpage;
		this._firstpage=tmp;
		this.gotohorizontal(this._current.horizontal-1);
		this.pagechanged();
	},
	__switchtoupper:function() {
		var tmp;
		this.leavepage(0); // Leave from the current page		
		tmp=this._lowerpage;
		this._lowerpage=this._currentpage;
		this._currentpage=this._upperpage;
		this._upperpage=tmp;
		this.gotovertical(this._current.vertical-1);
		this.pagechanged();
	},	
	pagechanged:function() {
		browse._locked=false;
		browse._baseyscroll=0;
		if (browse._guishown) browse.togglegui(); // Hide the gui every page change
		this.setcontenttopages(); // Set content when the page changed for the new hidden pages.
		this.layoutpages();	// Relayout pages the changed page
		this.layoutbullets(); // Move the bullet after the page change
		this.updategui(); // Update the bar content according to the current position
		this.layoutgui(); // Show/hide the extra bar accordingly
		this.replacepage(0,this._currentpage); // Update the current page.
		this.savecurrentpage(); // Save the current page
	},
	
	// ---
	// Page traveling
	// ---
	starttravel:function() {
		if (this._travel&&(this._pagestack.topmostpage==this._currentpage)) { // Travelling is allowed only if we're on the browser. Is paused on modals
			if (browse._guishown) browse.togglegui(); // Hide the gui before starting the page travel as feedback
			var travelgap=Math.abs(this._current.horizontal-this._travel.horizontal);
			if ((this._current.sectionid!=this._travel.sectionid)||((this._current.magazineversion.metadata.pangapthreshold!==null)&&(travelgap>this._current.magazineversion.metadata.pangapthreshold)))
				this.__switchtopage(this._travel.sectionid,this._travel.horizontal,this._travel.vertical);				
			else if (this._current.horizontal<this._travel.horizontal) {
				this._scrollside=1; // vertical
				this._xscroll=-browse._settings.spring.sensitivity-1; // Right
				this.dospring(); // Make the spring move the page the page
			} else if (this._current.horizontal>this._travel.horizontal) {
				this._scrollside=1; // vertical
				this._xscroll=browse._settings.spring.sensitivity+1; // Left
				this.dospring(); // Make the spring move the page the page
			} else if (this._current.vertical<this._travel.vertical) {
				this._scrollside=2; // vertical
				this._yscroll=-browse._settings.spring.sensitivity-1; // Down
				this.dospring(); // Make the spring move the page the page
			} else if (this._current.vertical>this._travel.vertical) {
				this._scrollside=2; // vertical
				this._yscroll=browse._settings.spring.sensitivity+1; // Down
				this.dospring(); // Make the spring move the page the page
			} else {
				this._travel=null;
			}
		}	
	},	
	
	// ---
	// Springboard callable actions
	// ---
	
	__switchtopage:function(section,horz,vert) {
		this.leavepage(0); // Leave from the current page
		this.jumpto(section,horz,vert);	
		this._travel=null; // Cancel any further travel
		browse.pagechanged();		
	},

	
	// --
	// Springboard cosmetics
	// --
	makeshadowbox:function() {
		if (!this._hardware.boxshadow) {
			this._shadowbox=null;
			return;
		}
		this._shadowbox.h=document.createElement("div");
		this._shadowbox.h.style.position="absolute";
		this._shadowbox.h.style.zIndex=0;
		this._shadowbox.h.style.height="1px";
		this._shadowbox.h.style.backgroundColor="black";
		this._shadowbox.h.style[this._hardware.boxshadow.js]="0px 0px 4px #000";
		this._display.appendChild(this._shadowbox.h);

		this._shadowbox.v=document.createElement("div");
		this._shadowbox.v.style.position="absolute";
		this._shadowbox.v.style.zIndex=0;
		this._shadowbox.v.style.width="1px";
		this._shadowbox.v.style.backgroundColor="black";
		this._shadowbox.v.style[this._hardware.boxshadow.js]="0px 0px 4px #000";
		this._display.appendChild(this._shadowbox.v);
			
	},
	showshadows:function() {
		if (!this._hardware.boxshadow) return;
		if (browse._scrollside==1) {
			this._shadowbox.v.style.height=this._currentpage.obj.offsetHeight+"px";
			this._shadowbox.v.style.display="block";	
		} else {
			this._shadowbox.h.style.width=this._currentpage.obj.offsetWidth+"px";
			this._shadowbox.h.style.display="block";	
		}
	},
	hideshadows:function() {
		if (!this._hardware.boxshadow) return;
		this._shadowbox.h.style.display="none";	
		this._shadowbox.v.style.display="none";	
	},


	// ---
	// Springboard GUI
	// ---
	makegui:function() {
		this._gui=document.createElement("div");
		this._gui.style.position="absolute";
		this._gui.className="gui-bar";
		this._gui.id="_gui";
		this._gui.style.zIndex=1000;
		this._display.appendChild(this._gui);
	
		this._extrabar=document.createElement("div");
		this._extrabar.style.position="absolute";
		this._extrabar.style.display="none";
		this._extrabar.className="extra-bar";
		this._extrabar.id="_extrabar";
		this._extrabar.style.zIndex=1000;
		this._display.appendChild(this._extrabar);		
		
	},
	makebullets:function() {
		this._bulletbox=document.createElement("div");
		this._bulletbox.style.position="absolute";
		this._bulletbox.id="_bulletbox";
		this._bulletbox.style.zIndex=1000;
		this._display.appendChild(this._bulletbox);
	},
	applybulletstyle:function() {
		if (this._current.magazineversion.gui) {
			this._bulletbox.style.width=this._current.magazineversion.gui.bulletsize+"px";
			this._bulletbox.style.left=this._current.magazineversion.gui.margin+"px";
			this._bulletbox.style.opacity=this._current.magazineversion.gui.opacity;
			this._bulletbox.style.display="block";
		} else this._bulletbox.style.display="none";
	},
	updategui:function() {
		if (this._guishown&&this._current.magazineversion.gui) {
			this._gui.innerHTML=this.applystandardplaceholders(this._current.magazineversion.gui.headercontent,this._current);
			this.addstaticevents(this._gui,true);
		}
		if (this._current.article.extra) {
			this._extrabar.innerHTML=this.applystandardplaceholders(this._current.article.extra,this._current);
			this.addstaticevents(this._extrabar,true);
		} else
			this._extrabar.innerHTML="";			
	},
	layoutgui:function() {
		this._gui.style.width=this._width+"px";
		this._extrabar.style.width=this._width+"px";
		if (!this._current.magazineversion.gui||(this._guicounter==-1)) {
			this._gui.style.display="none";
			this._extrabar.style.display="none";		
		} else {
			this._gui.style.height=this._current.magazineversion.gui.headerheight+"px";
			this._gui.style.display="block";
			this._extrabar.style.display=(browse._current.article.extra?"block":"none");
			this._extrabar.style.height=this._current.magazineversion.gui.extrabarheight+"px";
			this.displaceobject(this._gui,0,(this._current.magazineversion.gui.headerheight*this._guicounter));
			this.displaceobject(this._extrabar,0,(this._height-(this._current.magazineversion.gui.extrabarheight*(1+this._guicounter))));		
		}
	},
	togglegui:function() {
		this._guishown=!this._guishown;
		this.updategui(); // Update the bar content if was hidden before
		this._animatinggui=true;
		this.animgui(); // Start animating the gui for the toggle command
	},	
	animgui:function() {
		if (browse._guishown) {
			browse._guicounter+=0.1;
			if (browse._guicounter>=0) {
				browse._guicounter=0;
				browse._animatinggui=false;
			}
		} else {
			browse._guicounter-=0.1;
			if (browse._guicounter<=-1) {
				browse._guicounter=-1;
				browse._animatinggui=false;
			}
		}
		browse.layoutgui(); // Displace the gui elements for the animation
		if (browse._animatinggui) setTimeout(browse.animgui,10); // Keep animating the gui, if needed
	},	
	layoutbullets:function() {
		if (this._current.magazineversion.gui) {
			if ((browse._current.article.pages.length>1)&&!browse._current.pagedata.scrollpage) {
				this._bulletbox.style.top=((this._height-(browse._current.article.pages.length*(this._current.magazineversion.gui.bulletsize+this._current.magazineversion.gui.bulletspacing)))/2)+"px";
				var html="";
				for (var i=0;i<browse._current.article.pages.length;i++) {
					html+="<img style='float:left;width:"+this._current.magazineversion.gui.bulletsize+"px;height:"+this._current.magazineversion.gui.bulletsize+"px;margin-bottom:"+this._current.magazineversion.gui.bulletspacing+"px' src='";
					if (i==this._current.vertical) html+=this._current.magazineversion.gui.filled; else html+=this._current.magazineversion.gui.empty;
					html+="'>";
				}
				this._bulletbox.innerHTML=html;
				this._bulletbox.style.display="block";
			} else this._bulletbox.style.display="none";
		}
	},
	makescrollbar:function() {
		this._scrollbar=document.createElement("div");
		this._scrollbar.style.position="absolute";
		this._scrollbar.style.backgroundColor="black";
		this._scrollbar.id="_scrollbar";
		this._scrollbar.style.zIndex=1000;
		this._display.appendChild(this._scrollbar);

		this._vscrollbar=document.createElement("div");
		this._vscrollbar.style.position="absolute";
		this._vscrollbar.style.backgroundColor="black";
		this._vscrollbar.id="_vscrollbar";
		this._vscrollbar.style.zIndex=1000;
		this._display.appendChild(this._vscrollbar);
	},
	applyguistyle:function() {
		if (this._current.magazineversion.gui) {
			this._vscrollbar.style.width=this._current.magazineversion.gui.barheight+"px";
			this._vscrollbar.style.opacity=this._current.magazineversion.gui.opacity;
			this._vscrollbar.style.display="block";
			this._scrollbar.style.opacity=this._current.magazineversion.gui.opacity;
			this._scrollbar.style.height=this._current.magazineversion.gui.barheight+"px";
			this._scrollbar.style.display="block";
		} else {
			this._vscrollbar.style.display="none";
			this._scrollbar.style.display="none";
		}
	},

	// *********************
	// PAGE STACK LOGICAL PART
	// *********************
	// ---
	// Page events
	// ---
	broadcastevent:function(list,eventname,event) {
		if (!event) event={};
		event.event=eventname;
		for (var a=0;a<list.hotspots.length;a++){
			if (list.hotspots[a].obj.onevent)
				list.hotspots[a].obj.onevent(event);
			if (list.hotspots[a].obj[eventname])
				list.hotspots[a].obj[eventname](event);
			}
	},
	
	// ---
	// Page stack handling
	// ---
	updatepage:function(page) {
		if (!this._pagestack.topmostpage)
			this.pushpage(page); // First updatepage. Push the screen on the top.
		else if (page==this._pagestack.topmostpage) { // If is the active page
			if (!page.shown) { // If wasn't shown
				this.cleanscheduler(browse._pagestack.topmostpage); // Clean the old schedules
				this.broadcastevent(page,"onpageshow"); // Broadcast a show event
				page.shown=true; // Now is shown
			} else { // If was already shown
				this.startscheduler(); // Just restore the old scheduler			
			}
			if (page==this._currentpage) { // If we're going back to the current page...
				this.starttravel(); // Redo the cached start travel
			}
		} else {
			page.shown=false; // Will be updated once will be the topmost view
		}
	},
	pushpage:function(page) {
		this._pagestack.stack.push(page);
		this._pagestack.topmostpage=page;
		this.updatepage(this._pagestack.topmostpage); // Eventually update the new current page
	},
	poppage:function() {
		var page=this._pagestack.stack.pop(); // Getting the leaving page
		this.broadcastevent(page,"onpageleave"); // Broadcast a leave to older page	
		this.cleanscheduler(page); // Clean the current scheduler
		this.applypage(page,null,null); // Remove the older content, if requested
		page.shown=false; // Mark the older page as not shown
		this._pagestack.topmostpage=this._pagestack.stack[this._pagestack.stack.length-1]; // Replace the new topmostpage
		this.updatepage(this._pagestack.topmostpage); // Update the new topmost page
	},
	leavepage:function(index) {
		var leaving=this._pagestack.stack[index]; // Get the leaving page
		if (leaving&&leaving.shown) {
			this.broadcastevent(leaving,"onpageleave"); // Broadcast a leave to older page	
			this.cleanscheduler(leaving); // Clean the older scheduler
			// Content is not removed, since is just a page replacement
			leaving.shown=false; // Mark the older page as not shown
		}
	},
	replacepage:function(index,page) {
		if (this._pagestack.stack.length==0) // If there isn't any page in the stack
			this.pushpage(page); // Push the page as the first one
		else {
			var leaving=this._pagestack.stack[index]; // Get the leaving page
			this.leavepage(index); // Leave from the page.
			if (leaving==this._pagestack.topmostpage) this._pagestack.topmostpage=page; // Replace the topmost page if was leaving.
			this._pagestack.stack[index]=page; // Replace with the new page
			this.updatepage(page); // Updates the new page
		}
	},
	pointisinteractive:function(x,y,rec) {
		if ((this._extrabar.style.display!="none")&&(y>this._height-this._current.magazineversion.gui.extrabarheight)) return true;
		if ((this._gui.style.display!="none")&&(y<this._current.magazineversion.gui.headerheight)) return true;
		
		for (var a=0;a<browse._pagestack.topmostpage.hotspots.length;a++)  {
			var o2=browse._pagestack.topmostpage.hotspots[a];
			var travel=o2.obj;
			if (travel.style.display!="none") {
				var cx=travel.offsetLeft;
				var cy=travel.offsetTop;
				while (travel.parentNode) {
					travel=travel.parentNode;
					if (travel.offsetLeft) cx+=travel.offsetLeft;
					if (travel.offsetTop) cy+=travel.offsetTop;
				}
				if (o2.interactive&&(!((y<(cy+this._baseyscroll)) || (y>cy+this._baseyscroll+o2.obj.offsetHeight-1) || (x<cx) || (x>cx+o2.obj.offsetWidth-1))))
					return o2;
			}
		}
		return null;
	},
	
	// ---
	// Unified scheduler
	// ---
	cleanscheduler:function(sc) {
		sc.schedules=[];	
		sc.gc=[];		
		sc.paused=true;
	},
	pausescheduler:function() {
		if (browse._scheduler.timer) {
			clearTimeout(browse._scheduler.timer);
			browse._scheduler.timer=null;
		}
		browse._scheduler.paused=true;
	},
	startscheduler:function() {
		if (browse._scheduler.paused) {
			browse._scheduler.paused=false;
			if (browse._scheduler.timer==null) {
				browse.doschedule();
			}
		}
	},
	schedule:function(page,time,obj,fn,args) {
		var p={time:time,count:0,action:fn,object:obj,args:args};
		page.schedules.push(p);
		this.startscheduler();
		return p;
	},
	removeschedule:function(page,sched) {
		if (page.schedules.length) {
			page.gc.push(sched);
		}
	},
	removeobjectschedules:function(page,obj) {
		if (page.schedules.length)
			for (var i=0;i<page.schedules.length;i++)
				if (page.schedules[i].object==obj) page.gc.push(page.schedules[i]);
	},
	doschedule:function() {
		var stat={processed:0,rescheduled:0,trashed:0,ongc:browse._pagestack.topmostpage.gc.length,onschedules:browse._pagestack.topmostpage.schedules.length};
		
		if (browse._pagestack.topmostpage.schedules.length&&!browse._scheduler.paused) {
			var newschedule=[];
			var oldgc=browse._pagestack.topmostpage.gc;
			browse._pagestack.topmostpage.gc=[];			
			for (var i=0;i<browse._pagestack.topmostpage.schedules.length;i++) {
				var keep=true;
				for (var z=0;z<oldgc.length;z++)
					if (browse._pagestack.topmostpage.schedules[i]==oldgc[z]) { keep=false; break; }
				if (keep) {
					browse._pagestack.topmostpage.schedules[i].count++;
					if (browse._pagestack.topmostpage.schedules[i].count>=browse._pagestack.topmostpage.schedules[i].time) {
						keep=!browse._pagestack.topmostpage.schedules[i].action.apply(browse._pagestack.topmostpage.schedules[i].object,browse._pagestack.topmostpage.schedules[i].args);
						browse._pagestack.topmostpage.schedules[i].count=0;
					}
					stat.processed++;
				}
				if (keep) {
					newschedule.push(browse._pagestack.topmostpage.schedules[i]);
					stat.rescheduled++;
				} else stat.trashed++;
			}
			browse._pagestack.topmostpage.schedules=newschedule;
			if (browse._pagestack.topmostpage.schedules.length&&!browse._scheduler.paused) 
				browse._scheduler.timer=setTimeout(browse.doschedule,10);
			else
				browse.pausescheduler();
		} else
			browse.pausescheduler();			
	},
	
	// ---
	// Modal
	// ---
	makemodal:function() {
		this._modalbox.obj=document.createElement("div");
		this._modalbox.obj.style.position="absolute";
		this._modalbox.obj.className="modalbox";
		this._modalbox.obj.id="_modalbox";
		this._modalbox.obj.style.overflow="hidden";
		this._modalbox.obj.style.display="none";
		this._modalbox.obj.style.zIndex=1100;
		this._display.appendChild(this._modalbox.obj);			
	},
	setcontenttomodal:function() {
		var cid=this.decidecontent(this._modalbox.originalpage)	;
		this.applypage(this._modalbox,cid,"m"+(cid.substr?cid:"modal"),"modal");
	},
	layoutmodal:function() {
		if (this._modalbox.ypos<1) {
			switch (this._modalbox.effect) {
				case "opacity": {
					this.displaceobject(this._modalbox.obj,0,0);
					this._modalbox.obj.style.opacity=1-this._modalbox.ypos;
					break;				
				}
				case "up": { // From up
					this.displaceobject(this._modalbox.obj,0,-this._height*this._modalbox.ypos);
					this._modalbox.obj.style.opacity=1;
					break;
				}
				case "left": { // From up
					this.displaceobject(this._modalbox.obj,-this._width*this._modalbox.ypos,0);
					this._modalbox.obj.style.opacity=1;
					break;
				}
				case "right": { // From up
					this.displaceobject(this._modalbox.obj,this._width*this._modalbox.ypos,0);
					this._modalbox.obj.style.opacity=1;
					break;
				}
				default:{ // From down
					this.displaceobject(this._modalbox.obj,0,this._height*this._modalbox.ypos);
					this._modalbox.obj.style.opacity=1;
				}
			}
			this._modalbox.obj.style.display="block";
		} else this._modalbox.obj.style.display="none";
	},
	togglemodal:function(animated) {
		browse.pausescheduler(); // Pauses the current page/the modal scheduler for animation
		this._modalbox.displayed=!this._modalbox.displayed;
		if (animated) {
			if (this._modalbox.displayed&&!this._settings.skipdelays) this._modalbox.delay=this._settings.modal.delay;
			this._modalbox.animating=true;
			this.animmodal();
		} else {
			this.endanimation(); // Forces the animation end
			browse.layoutmodal(); // Displace the modal
		}
	},
	showmodal:function(data,effect) {
		if (this.isbrowseridle()&&!this._modalbox.displayed) {
			this._modalbox.originalpage=data;
			this._modalbox.effect=effect;
			this.setcontenttomodal(); // Set the content
			this.togglemodal(true);
		}
	},
	hidemodal:function(animated) {
		if (this._modalbox.displayed) this.togglemodal(animated);	
	},
	endanimation:function() {
		this._modalbox.animating=false;
		if (this._modalbox.displayed) {
			this._modalbox.ypos=0;
			this.pushpage(this._modalbox); // Push the current page on the screen
		} else {
			this._modalbox.ypos=1;
			this.poppage(); // Go back to the previous page		
		}
	},
	animmodal:function() {
		if (browse._modalbox.delay) browse._modalbox.delay--; else
		if (browse._modalbox.displayed) {
			browse._modalbox.ypos=browse._modalbox.ypos/2;
			if (browse._modalbox.ypos<=0.001) {
				browse._modalbox.ypos=0;
				browse.endanimation();
			}
		} else {
			browse._modalbox.ypos+=(1-browse._modalbox.ypos)/2;
			if (browse._modalbox.ypos>=0.999) {
				browse._modalbox.ypos=1;
				browse.endanimation();
			}
		}
		browse.layoutmodal(); // Displace the modal for the animation
		if (browse._modalbox.animating) setTimeout(browse.animmodal,100); // Keep animating the modal, if needed
	},
	
	// *********************
	// SPRINGBOARD LOGICAL PART
	// *********************
	
	// ---
	// Current cache manager
	// ---
	_current:{
		// IDs
		magazineversionid:null,
		sectionid:null,
		// Numbers
		horizontal:null,
		vertical:null,
		
		// Cache
		positions:[],
		
		// Calculated
		magazineversion:null,
		sections:null,
		section:null,
		articles:null,
		article:null,
		page:null,
		selectedpage:null,
		pagedata:null,
		hasnextpage:null,
		hasprevpage:null,
		hasupperpage:null,
		haslowerpage:null
	},
	getvert:function(horz) {
		if (!this._current.positions[horz]) return 0; else return this._current.positions[horz];
	},
	decidecontent:function(contid,force) {
		if (contid.portrait)
			if ((!force&&this.islandscape())||(force&&force.landscape))
				contid=contid.landscape;
			else
				contid=contid.portrait;
		return contid;	
	},
	getcontentid:function(horz,vertgap) {
		return this.decidecontent(this._current.articles[horz].pages[this.getvert(horz)+vertgap]);
	},
	jumpto:function(sect,horz,vert) {
		this._current.positions=[];
		this._current.sectionid=sect;
		this._current.positions[horz]=vert;
		this._current.horizontal=horz;
		this._current.vertical=vert;
		this.updatecurrent();
	},
	gotohorizontal:function(hor) {
		this._current.horizontal=hor;
		this._current.vertical=this.getvert(this._current.horizontal);
		this.updatecurrent();
	},
	gotovertical:function(ver) {
		this._current.vertical=ver;
		this._current.positions[this._current.horizontal]=this._current.vertical;
		this.updatecurrent();
	},
	updatecurrent:function() {
		this._current.magazineversion=this._magazine.versions[this._current.magazineversionid];
		this._current.sections=this._current.magazineversion.sections;
		if (!this._current.magazineversion._sectionsindex) {
			this._current.magazineversion._sectionsindex={};
			for (var i=0;i<this._current.sections.length;i++) this._current.magazineversion._sectionsindex[this._current.sections[i].id]=i;
		}
		this._current.section=this._current.magazineversion.sections[this._current.magazineversion._sectionsindex[this._current.sectionid]];
		this._current.articles=this._current.magazineversion.articles[this._current.sectionid];
		this._current.article=this._current.articles[this._current.horizontal];
		this._current.page=this._current.article.pages[this._current.vertical];	
		this._current.selectedpage=this.getcontentid(this._current.horizontal,0);
		this._current.pagedata=this._magazine.data[this._current.selectedpage];
		this._current.hasnextpage=this._current.horizontal<this._current.articles.length-1;
		this._current.hasprevpage=this._current.horizontal>0;
		this._current.hasupperpage=this._current.vertical>0;
		this._current.haslowerpage=this._current.vertical<this._current.article.pages.length-1;
	},	

	// *********************
	// PAGE LAYOUT & CONTENT
	// *********************
	// ---
	// Layout & content
	// ---
	applystandardplaceholders:function(bar,data) {
		if (bar) {
			
			// First the most "generical" placeholders. So can contain the placeholders specified next.
			// Follow the hierarchy.
			
			if (this._magazine.metadata.placeholders)
				for (var i in this._magazine.metadata.placeholders)
					bar=bar.replace(new RegExp("#"+i+"#","g"),this._magazine.metadata.placeholders[i]);
			
			if (data&&(data.horizontal!==undefined)) {
				bar=bar.replace(/#articletitle#/g,(this._current.articles[data.horizontal].title?this._current.articles[data.horizontal].title:""));
				bar=bar.replace(/#articlesubtitle#/g,(this._current.articles[data.horizontal].subtitle?this._current.articles[data.horizontal].subtitle:""));
			} else {
				bar=bar.replace(/#articletitle#/g,"Article title");
				bar=bar.replace(/#articlesubtitle#/g,"Article subtitle");			
			}
			
			bar=bar.replace(/#sectionid#/g,this._current.section.id);
			bar=bar.replace(/#sectiontitle#/g,(this._current.section.title?this._current.section.title:""));
			bar=bar.replace(/#sectionsubtitle#/g,(this._current.section.subtitle?this._current.section.subtitle:""));
	
			bar=bar.replace(/#magazinetitle#/g,(this._magazine.metadata.title?this._magazine.metadata.title:""));
			bar=bar.replace(/#magazinenumber#/g,(this._magazine.metadata.number?this._magazine.metadata.number:""));
					
			// Calculated placeholders at last, so can be "nested"					
			bar=bar.replace(/#horizontal#/g,(data&&(data.horizontal!==undefined)?data.horizontal+1:0));
			bar=bar.replace(/#vertical#/g,(data&&(data.vertical!==undefined)?data.vertical+1:0));				
			bar=bar.replace(/#horizontalcount#/g,this._current.articles.length);
			bar=bar.replace(/#verticalcount#/g,this._current.article.pages.length);
			bar=bar.replace(/#orientation#/g,(this.islandscape()?"landscape":"portrait"));			
			bar=bar.replace(/#otherorientation#/g,(this.islandscape()?"portrait":"landscape"));	
			bar=bar.replace(/#toolname#/g,browse._settings.toolname);
			bar=bar.replace(/#toollicense#/g,browse._settings.toollicense);
			bar=bar.replace(/#bundlepath#/g,this._magazine.bundle);
					
		}			
		return bar;
	},
	addstaticevents:function(fath,skipfather,notrecurse) {
		if (!skipfather&&fath.getAttribute)
			if (fath.getAttribute("onobjecttap"))
				this.applytouchevents(fath,null,null,new Function("event","onobjecttap",fath.getAttribute("onobjecttap")));
		if (fath.childNodes&&!notrecurse)
			for (var b=0;b<fath.childNodes.length;b++)
				this.addstaticevents(fath.childNodes[b]);
	},
	makewidget:function(type,fath) {
		var wd=this._widgets[type];
		if (wd) {
			if (wd.global) for (var a in wd.global) fath[a]=wd.global[a];
		} else if ((fath.style!==undefined)&&(fath.innerHTML!==undefined)) {
			fath.style.backgroundColor="#cecece";
			fath.style.color="#ffff";
			fath.innerHTML="Missing widget <b>"+fath.getAttribute("widget")+"</b>";
		}
	},
	findhotspots:function(evts,trashcan,fath,page,idprefix,skipfather,key) {
		
		if (!key) key="-root";
		var myid=null;
		
		if (!skipfather&&fath.getAttribute&&fath.getAttribute) {
			
			var trashthis=false;
			// Gives unique id
			myid=(fath.getAttribute("id")?"-"+fath.getAttribute("id"):key);
			fath.containerpage=page;
			fath.setAttribute("widgetcontext",idprefix);
			fath.setAttribute("idprefix",idprefix);
			fath.setAttribute("id",idprefix+myid);
			var hasevents=false||fath.getAttribute("interactive")||fath.getAttribute("widget");
			if (!hasevents)
				for (var a=0;a<evts.length;a++)
					if (fath.getAttribute(evts[a])) { hasevents=true; break}
			if (hasevents) page.hotspots.push({obj:fath,interactive:fath.getAttribute("interactive")});

			// Add to trash if doesn't need to be rasterized.
			if (fath.getAttribute("dontrasterize")&&this._settings.nowidgets) trashthis=true;
			// Apply widget-related events (or removal)
			if (fath.getAttribute("widget")) {
				if (this._settings.nowidgets) trashthis=true;
				else this.makewidget(fath.getAttribute("widget"),fath);
			}
			// Apply standard inline events
			for (var a=0;a<evts.length;a++)
				if (fath.getAttribute(evts[a]))
					fath[evts[a]]=new Function("event",evts[a],fath.getAttribute(evts[a]));
					
			// Apply static events (but not to childs - this function will recurse)
			this.addstaticevents(fath,false,true);
			
			// Add to trash
			if (trashthis) trashcan.push(fath);
		}
		
		// Recurse
		if (fath.childNodes)
			for (var b=0;b<fath.childNodes.length;b++)
					this.findhotspots(evts,trashcan,fath.childNodes[b],page,idprefix,false,key+"-"+b)
	},
	_finalizeapplypage:function(){
		var task=this._applypagequeue.queue.splice(0,1)[0];
		task.page.obj.innerHTML=this.applystandardplaceholders(task.tx,task.data);

		// Assign unique page ids and fixes events
		var trashcan=[];
		this.findhotspots(["onpageshow","onpageleave","onpageprepare","onpagedestroyed","onpageresize","onpagedrag","onpagedrop","onpagespring","onevent"],trashcan,task.page.obj,task.page,task.idprefix,true);
		for (var a=0;a<trashcan.length;a++) trashcan[a].parentNode.removeChild(trashcan[a]);
		this.broadcastevent(task.page,"onpageprepare"); // Broadcast a preparing event

		if (task.callback) task.callback(true);
		if (this._applypagequeue.queue.length) {
			this.applypage();
		} else {
			this._applypagequeue.busy=false;
		}
	},
	_applytemplate:function(data) {
		var task=this._applypagequeue.queue[0];
		if (task.page.page.template) { // Merge with the inline template and replace placeholders (callback)
			switch (task.phase) {
				case 1:{
					if (this._settings.debug>0) console.log("applying placeholders");
					var lines=data.split("\n");
					task.ph={};
					lines.push("@");
					var cnt="";
					var cid="";
					var ct=null;
					for (var i=0;i<lines.length;i++) {
						if (lines[i].charAt(0)=="@") {
							if (ct) {
								cnt=cnt.replace(/^\s+|\s+$/g,"");
								ct[1]=ct[1].replace(/^\s+|\s+$/g,"");
								switch (ct[0]) {
									case "TEXT": { task.ph[ct[1]]=this.htmlentities(cnt); break }
									case "HTML": { task.ph[ct[1]]=cnt; break }
									case "BRHTML": { task.ph[ct[1]]=cnt.replace(/\n/g,"<br>"); break }
									case "URL": { task.ph[ct[1]]=cnt; break }
								}
							}
							cnt="";
							ct=lines[i].substr(1).split(":");
						} else cnt+=lines[i]+"\n";
					}
					task.phase=10;
					this._applytemplate();
					break;			
				}
				case 10:{
					if (task.ph) for (var a in task.ph)
						task.tx=task.tx.replace(new RegExp("#"+a+"#","g"),task.ph[a]);
					this._finalizeapplypage();
					if (this._settings.debug>0) console.log("done!");
					break;
				}
				default: {
					if (data==undefined) task.counter=0; else {
						if (this._settings.debug>0) console.log("loaded");
						task.tx+=data;
						task.counter++;
					}
					if (task.counter<task.page.page.template.length) {
						if (this._settings.debug>0) console.log("loading template",task.counter+1,"of",task.page.page.template.length,this._magazine.templates[task.page.page.template[task.counter]].file);
						this.geturldata(this._magazine.templates[task.page.page.template[task.counter]].file,this._applytemplate,this);
					} else {
						task.ph=task.page.page.placeholders;
				
						 // Copies the placeholders from another page
						if (task.ph&&task.ph.like)
							task.ph=this._magazine.data[task.ph.like].placeholders;

						if (task.ph&&task.ph.substr) { 
							task.phase=1;
							if (this._settings.debug>0) console.log("Loading placeholders",task.ph);
							this.geturldata(task.ph,this._applytemplate,this);
						} else {
							task.phase=10;
							this._applytemplate();
						}
					}
				}
			}
		} else this._finalizeapplypage();
	},
	_applypage:function(data) {
		var task=this._applypagequeue.queue[0];
		if (task.page.page.substr) { // If just a string is specified, the HTML content is set (callback)
			task.tx+=data;
			this._applytemplate();
		} else if (task.page.page.file) { // An external file is specified. (callback)
			task.tx+=data;
			this._applytemplate();
		}
	},
	applypage:function(page,content,idprefix,data,callback) {
		if (page!=undefined) {
			if (content==page.pageid) {
				if (callback) callback(false);
			} else if (!content) {
				page.pageid=null;
				page.page=null;
				page.hotspots=[];
				page.obj.innerHTML=null;
				if (callback) callback(true);
			} else { // schedule
				this._applypagequeue.queue.push({page:page,content:content,idprefix:idprefix,data:data,callback:callback});
				if (!this._applypagequeue.busy) this.applypage(); else if (this._settings.debug>0) console.log("Applypage Enqueued.")
			}
		} else {
			
			var task=this._applypagequeue.queue[0];
			this._applypagequeue.busy=true;

			if (task.tx==undefined) {
				task.tx="";
				task.page.pageid=task.content;
				task.page.pageprefix=task.idprefix;
				if (task.content.substr) // If the content is a plain string, refer to its data
					task.page.page=this._magazine.data[task.content];
				else task.page.page=task.content; // else set the static page data
				task.page.shown=false;
				task.page.hotspots=[];		
				this.resizepage(task.page,false); // Do not trigger the event - is resized just for startup
			}
		
			
			if (task.page.page.substr) // If just a string is specified, the HTML content is set
				this.geturldata(task.page.page,this._applypage,this);
			else {
				if (task.page.page.image) {// A page with background image. Is behind everything else.
					task.tx+="<div style=\"overflow:hidden;width:100%;height:100%;background-image:url('"+task.page.page.image+"');background-repeat:no-repeat;background-position:center;\"></div>";					
					this._applytemplate();
				} else if (task.page.page.html) { // Add the HTML defined in the issue files
					task.tx+=task.page.page.html;
					this._applytemplate();
				} else if (task.page.page.file) { // An external file is specified.
					this.geturldata(task.page.page.file,this._applypage,this);
				} else if (task.page.page.widget) { // Add a full screen widget, if needed.
					task.tx+="<div style=\"overflow:hidden;width:100%;height:100%;"+(task.page.page.style?task.page.page.style:"")+"\" fullscreen='yes' interactive='yes' widget='"+task.page.page.widget+"' "+(task.page.page.attrs?task.page.page.attrs:"")+">"+(task.page.page.widgetcontent?task.page.page.widgetcontent:"")+"</div>";
					this._applytemplate();
				} else if (task.page.page.template) { // Merge with the inline template and replace placeholders
					this._applytemplate();
				}
			}
			
		}
	},
	
	// ---
	// Page resize
	// ---
	makepages:function() {
		this._firstpage.obj=this.makepage("_first");
		this._currentpage.obj=this.makepage("_current");
		this._nextpage.obj=this.makepage("_next");
		this._upperpage.obj=this.makepage("_upper");
		this._lowerpage.obj=this.makepage("_lower");
		this._display.appendChild(this._firstpage.obj);
		this._display.appendChild(this._currentpage.obj);
		this._display.appendChild(this._nextpage.obj);
		this._display.appendChild(this._upperpage.obj);
		this._display.appendChild(this._lowerpage.obj);
	},
	resizepage:function(page,sendevent) {
		if (page.pageid) {
			if (page.page&&page.page.scrollpage) {
				page.obj.style.width=this._width+"px";
				page.obj.style.minHeight=this._height+"px";
				page.obj.style.height=null;				
			} else {
				page.obj.style.width=this._width+"px";
				page.obj.style.minHeight=null;		
				page.obj.style.height=this._height+"px";		
			}
			var classname=page.classname+" page-"+(this.islandscape()?"landscape":"portrait")+"-"+this.solvepagealias(page.pageid)+" page-"+this.solvepagealias(page.pageid)+" page";
			if (page.obj.className!=classname) page.obj.className=classname;
			if (sendevent) this.broadcastevent(page,"onpageresize"); // Broadcast a page resize if requested
		}
	},
	cacheddisplaceobject:function(page,x,y) {
		if (page.sum!=x+y) {
			this.displaceobject(page.obj,x,y);
			page.sum=x+y;
		}
	},
	layoutpages:function() {
		this.cacheddisplaceobject(this._firstpage,(-this._width+this._xscroll),0);
		this.cacheddisplaceobject(this._nextpage,(this._width+this._xscroll),0);
		if (!browse._current.pagedata.scrollpage) {
			this.cacheddisplaceobject(this._upperpage,0,(-this._height+this._yscroll));
			this.cacheddisplaceobject(this._lowerpage,0,(this._height+this._yscroll));
		}
		this.cacheddisplaceobject(this._currentpage,this._xscroll,browse._baseyscroll+this._yscroll);
		if (this._shadowbox) {
			if (this._xscroll>0) this.displaceobject(this._shadowbox.v,this._xscroll,0);
			else if (this._xscroll<0) this.displaceobject(this._shadowbox.v,this._currentpage.obj.offsetWidth+this._xscroll-1,0);
			if (this._yscroll>0) this.displaceobject(this._shadowbox.h,0,this._yscroll);
			else if (this._yscroll<0) this.displaceobject(this._shadowbox.h,0,this._currentpage.obj.offsetHeight+this._yscroll+this._baseyscroll-1);
		}
		// Layout the scroll bar
		if (this._current.magazineversion.gui) {
			var mw=this._width-(this._current.magazineversion.gui.margin*2);
			var w=mw/this._current.articles.length;
			var x=(this._current.horizontal*w)-(w*this._xscroll/this._width);
			if (x<0) { w+=x; x=0 }
			if (x+w>mw) { w-=(x+w-mw); x=mw-w; }
			if (w!=mw) {
				this._scrollbar.style.width=w+"px";
				this.displaceobject(this._scrollbar,this._current.magazineversion.gui.margin+x,this._height-this._current.magazineversion.gui.barheight-this._current.magazineversion.gui.margin);
				this._scrollbar.style.display="block";
			} else this._scrollbar.style.display="none";
			if (browse._current.pagedata&&browse._current.pagedata.scrollpage) {
				var mh=this._height-(this._current.magazineversion.gui.margin*2);
				var h=mh*this._height/this._currentpage.obj.offsetHeight;
				var y=mh*(-this._yscroll-this._baseyscroll)/this._currentpage.obj.offsetHeight;
				if (y<0) { h+=y; y=0 }
				if (y+h>mh) { h-=(y+h-mh); y=mh-h; }
				if (h!=mh) {
					this._vscrollbar.style.height=h+"px";
					this.displaceobject(this._vscrollbar,this._current.magazineversion.gui.margin,this._current.magazineversion.gui.margin+y);
					this._vscrollbar.style.display="block";
				} else this._vscrollbar.style.display="none";
			} else this._vscrollbar.style.display="none";
		}
	},
	// ---
	// Page update
	// ---	
	setcontenttopage:function(page,horz,vert) { // pagenumber == -1, custom pages
		var cid=this.getcontentid(horz,vert);
		var cvert=(this.getvert(horz)+vert);
		page.obj.style.display="block";
		if ((page==this._currentpage)&&(cid!=page.pageid)) this.leavepage(0); // Detected a content change of the center page.
		return this.applypage(page,cid,"c"+cid+"s"+this._current.sectionid+"h"+horz+"v"+cvert,{horizontal:horz,vertical:cvert});
	},
	removecontenttopage:function(page) {
		this.applypage(page,null,null);
		page.obj.style.display="none";	
	},
	setcontenttopages:function() {
		if (this._current.hasprevpage) this.setcontenttopage(this._firstpage,this._current.horizontal-1,0); else this.removecontenttopage(this._firstpage);
		if (this._current.hasnextpage) this.setcontenttopage(this._nextpage,this._current.horizontal+1,0); else this.removecontenttopage(this._nextpage);
		if (browse._current.pagedata.scrollpage) {
			this.removecontenttopage(this._upperpage);
			this.removecontenttopage(this._lowerpage);
		} else {
			if (this._current.hasupperpage) this.setcontenttopage(this._upperpage,this._current.horizontal,-1); else this.removecontenttopage(this._upperpage);
			if (this._current.haslowerpage) this.setcontenttopage(this._lowerpage,this._current.horizontal,1); else this.removecontenttopage(this._lowerpage);
		}
		if (this.setcontenttopage(this._currentpage,this._current.horizontal,0)) { // If the center page changed...
			this._yscroll=0;// reset scroll
			this._xscroll=0;		
			this._baseyscroll=0;		
		}
		this.savecurrentpage(); // Save the current page
	},
	// ---
	// Page lock
	// ---
	setpagelock:function(lk) {
		this._locked=lk;
	},
	togglepagelock:function() {
		this._locked=!this._locked;
	},
	getpagelock:function(lk) {
		return this._locked;
	},
	
	// ---
	// Version decider
	// ---			
	decideversion:function() {
		var nextversion="";
		for (var a=0;a<this._magazine.version.length;a++) {
			var itm=this._magazine.version[a];
			var doit=true;
			if (itm.sizemorethan) doit=doit&&((this._width>itm.sizemorethan.width)&&(this._height>itm.sizemorethan.height));
			if (itm.sizelessthan) doit=doit&&((this._width<itm.sizelessthan.width)&&(this._height<itm.sizelessthan.height));
			if (itm.sizeis) doit=doit&&((this._width==itm.sizeis.width)&&(this._height==itm.sizeis.height));
			if (itm.isipad) doit=doit&&(navigator.userAgent.match(/iPad/i));
			if (itm.isiphone) doit=doit&&(navigator.userAgent.match(/iPhone/i));
			if (itm.isipod) doit=doit&&(navigator.userAgent.match(/iPod/i));
			if (itm.isstandalone) doit=doit&&navigator.standalone;
			if (itm.isinbrowser) doit=doit&&!navigator.standalone;
			if (itm.isonline) doit=doit&&navigator.onLine
			if (itm.isoffline) doit=doit&&!navigator.onLine
			if (itm.islandscape) doit=doit&&this.islandscape();
			if (itm.isportrait) doit=doit&&!this.islandscape();
			if (doit) {
				nextversion=itm.id;
				if (this._settings.debug>0) console.log("Decided version: "+nextversion+" (width:"+this._width+", height:"+this._height+")");			
				break;
			} else
				if (this._settings.debug>0) console.log("Falied deciding version: "+itm.id+" (width:"+this._width+", height:"+this._height+")");						
		}
		if (nextversion!=this._current.magazineversionid) {
			this._current.magazineversionid=nextversion;
			this.leavepage(0); // Leave from the current page since we're going to apply another version
			this.hidemodal(false); // Dismiss the current modal without any animation
			this.restorecurrentpage(); // Restore the current saved page (if any)
			this.updatecurrent(); // Updates the new current page references
			this.applyguistyle(); // Apply the GUI style of the new version
			this.applybulletstyle(); // Apply the bullet style of the new version
		}
	},	
	
	
	// *********************
	// STARTUP LOADING PHASE
	// *********************
	loadcss:function(file) {
		if (!this._loadedfiles[file]) {
			if (this._settings.debug>0) console.log("Loading CSS: "+file);
			this._loadedfiles[file]=true;
			var headID = document.getElementsByTagName("head")[0];         
			var css = document.createElement('link');
			css.setAttribute('rel', 'stylesheet');
			css.setAttribute('type', 'text/css');
			css.setAttribute('href',file);
			headID.appendChild(css);
		}
	},
	loadjs:function(file) {
		if (!this._loadedfiles[file]) {
			if (this._settings.debug>0) console.log("Loading JS: "+file);
			this._loadedfiles[file]=true;
			browse._toload++;
			var headID = document.getElementsByTagName("head")[0];         
			var js = document.createElement('script');
			js.setAttribute('type', 'text/javascript');
			js.setAttribute('src',file);
			this.addEventListener(js,'load',this.objloaded);
			headID.appendChild(js);
		}
	},
	objloaded:function() {
		browse._loaded++;
		if (browse._loaded==browse._toload)
			browse.doloadphase();
	},
	addcss:function(file){ if (this._settings.recordloading.enabled) this._recorder.css.push(file); this._loader.current.cnt++;this._loader.current.css.push(file)},
	addjs:function(file){ if (this._settings.recordloading.enabled) this._recorder.js.push(file); this._loader.current.cnt++;this._loader.current.js.push(file)},
	addplugin:function(file){ if (this._settings.recordloading.enabled) this._recorder.plugin.push(file); this._loader.current.cnt++;this._loader.current.plugins.push(file)},
	switchnextloader:function() {
		this._loader.current=(this._loader.current==this._loader.one?this._loader.two:this._loader.one);
		this._loader.current.css=[];
		this._loader.current.js=[];
		this._loader.current.plugins=[];
		this._loader.current.cnt=0;
	},
	doloadphase:function() {
		switch (this._loadphase) {
			case 0: { // Load the first bundle
				browse._toload++;
				
				if (this._settings.tool=="thumbnail") { // A screenshot of the page, scaled
				
					this._settings.enablepassivepopups=false;
				
					this.resize=function(){}; // Disable resize.
					this._width=this._settings.thumbnailer.originalwidth; 
					this._height=this._settings.thumbnailer.originalheight;
				
					// Creates a thumb container that "crops" the page.
					var thumb=document.createElement("div");
					thumb.style.width=(this._width*this._settings.thumbnailer.scale)+"px";
					thumb.style.height=(this._height*this._settings.thumbnailer.scale)+"px";
					thumb.style.overflow="hidden";
					document.body.removeChild(this._display);
					thumb.appendChild(this._display);
					document.body.appendChild(thumb);
					
					// Screen size
					this._display.style.width=(this._settings.thumbnailer.originalwidth)+"px";
					this._display.style.height=(this._settings.thumbnailer.originalheight)+"px";
					this._display.style.top=-((this._height/2)-(this._height*this._settings.thumbnailer.scale/2))+"px";
					this._display.style.left=-((this._width/2)-(this._width*this._settings.thumbnailer.scale/2))+"px";
					// Stretch
					this._display.style[this._hardware.transform.js]="scale("+this._settings.thumbnailer.scale+")"
					
				} else if (this._settings.tool=="showpage") { // A screenshot of the page with given size.

					this._settings.enablepassivepopups=false;
					
					if (this.geturlparameter("width")) {
						this._width=this.geturlparameter("width")*1;
						this._display.style.width=this._width+"px";	
					} else this._width=this._display.offsetWidth; 

					if (this.geturlparameter("height")) {
						this._height=this.geturlparameter("height")*1;
						this._display.style.height=this._height+"px";
					} else this._height=this._display.offsetHeight;
					
					
				} else {
				
					// Detect the display size
					this._width=this._display.offsetWidth; 
					this._height=this._display.offsetHeight;
					
				}
				
				this._loadphase++;				
				browse.switchnextloader();				
				// If we're rasterizing, let's record the loaded resources for replicating
				// into the rasterized version.
				if (this._settings.tool=="rasterizer") this._settings.recordloading={enabled:true,recursive:false};
				this.loadjs(this._magazine.bundle+"/"+this._magazine.bundlefile);
				this.objloaded();				
				break;
			}
			case 1: { // Recursively load bundles
				browse._toload++;
				// Disable the recursive loading recording, if enabled
				if (this._settings.recordloading.enabled&&!this._settings.recordloading.recursive) this._settings.recordloading.enabled=false;
				
				var toload=this._loader.current;
				
				// Initialize all the uninitialized plugins
				for (var a in this._widgets) {
					if (!this._widgets[a]._initialized&&this._widgets[a].init)
						this._widgets[a].init();
					this._widgets[a]._initialized=true;
				}
				
				
				// If there isn't anything to be loaded from the last call...
				if (toload.cnt==0) // All done, continue loading
					this._loadphase++;
				else {
					browse.switchnextloader();
					
					for (var i=0;i<toload.css.length;i++) this.loadcss(toload.css[i]);
					for (var i=0;i<toload.js.length;i++) this.loadjs(toload.js[i]);
					for (var i=0;i<toload.plugins.length;i++) this.loadjs("plugins/"+toload.plugins[i]+".js");
					
				}	
				this.objloaded();
				break;
			}
			case 2: {
			
				browse._toload++;
				this._loadphase++;				
			
				// Apply magazine various meta
				if (this._magazine.metadata) {
					document.title=(this._magazine.metadata.apptitle?this._magazine.metadata.apptitle:this._magazine.metadata.title);
					if ((navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i))&&this._magazine.metadata.splashiphone) {
						this.addheadlink({
							rel:"apple-touch-startup-image",
							href:this._magazine.metadata.splashiphone.portrait
						});
						// TODO how to set the landscape view too?
					}
					
					if (navigator.userAgent.match(/iPad/i)&&this._magazine.metadata.splashipad) {
						this.addheadlink({
							rel:"apple-touch-startup-image",
							href:this._magazine.metadata.splashipad.portrait
						});
						// TODO how to set the landscape view too?
					}
					 if (this._magazine.metadata.icon) {
						if (this._magazine.metadata.icon.iphone)
							this.addheadlink({
								rel:"apple-touch-icon",
								href:this._magazine.metadata.icon.iphone
							});
						if (this._magazine.metadata.icon.ipad)
							this.addheadlink({
								rel:"apple-touch-icon",
								sizes:"72x72",
								href:this._magazine.metadata.icon.ipad
							});
					}
				}
				
				
				switch (this._settings.tool) {
					case "offline": {
						this.fullscreenmessage(
							"<h1>Welcome to the offline magazine maker tool!</h1>"+
							"For making your magazine readable offline you need to create a <i>manifest file</i> that lists all the files that have to be kept offline and to link the manifest file in the <i>index.html</i> of your magazine.<br>"+
							"A quick way for creating a manifest file is to run this line of script from your magazine folder:<br><br><tt>"+
							this.htmlentities("(echo \"CACHE MANIFEST\";echo \"# generated at $(date)\";for d in \"libs\" \"plugins\" \"issues/common\" \""+this._magazine.bundle+"\"; do find \"$d\" -not -name \".*\" -type f ; done) > "+this._magazine.metadata.uid+".cache")+
							"</tt><br><br>This will create a <i>"+this._magazine.metadata.uid+".cache</i> in your magazine directory with all the files of your magazine. If you need more offline resources, just add them to the list.<br>"+
							"When your manifest file is ready, open your <i>index.html</i> (or the file you've created for reading your magazine) and add this attribute to the <tt>&lt;HTML&gt;</tt> tag:<br><br><tt>"+
							"&lt;html <b>manifest=\""+this._magazine.metadata.uid+".cache\"</b>&gt;"+
							"</tt><br><br>The magazine will start downloading and the next time its link is opened the magazine browser will automatically show the proper GUI. If you're going to update or add files to your magazine, remember to add them to the manifest file or change something into the manifest file too in any case, like changing manually the generation data on the second line of the manifest file - or just running the script line above once again.<br>"+
							"Your server <i>must</i> serve the manifest file sending the <tt>text/cache-manifest</tt> content type, so make sure that your server is configured properly. If you can't access to your server configuration, you can write a little wrapper - depending on the server side scripting language you can use.<br>"+
							"If your server is supporting PHP, you can proxy your manifest file saving a PHP file containing this simple line of code:<br><br><tt>"+
							"&lt;?php header(\"Content-type: text/cache-manifest\"); readfile(\""+this._magazine.metadata.uid+".cache\") ?&gt;"+
							"</tt><br><br>And then pointing this PHP file in the <tt>&lt;HTML&gt;</tt> tag instead of the original manifest file."
							);
						break;
					}
					case "thumbnailer": {
						var txt="";
						for (var a in this._magazine.data)
							txt+=document.location.href.replace(/\?.*/,"")+"?tool=thumbnail&page="+a+"\n";
						this.fullscreenmessage(
							"<h1>Welcome to the thumbnailer tool!</h1>"+
							"Use this file list for creating the pages thumbnail to be used in the index. You can use the Firefox plugin <a style='color:white' href='https://addons.mozilla.org/en-US/firefox/addon/7800/'>Grab Them All</a> (sources <a style='color:white' href='http://code.google.com/p/grabthemall/'>here</a>). Use these settings:<br><br>"+
							"<b>Image format:</b> PNG<br>"+
							"<b>Screenshot type:</b> Grab complete page<br>"+
							"<b>Screen shot file names:</b> Safe URL<br>"+
							"<b>Report file</b> unchecked<br>"+
							"<b>Width</b> "+Math.floor(this._settings.thumbnailer.originalwidth*this._settings.thumbnailer.scale)+"<br>"+
							"<b>Height</b> "+Math.floor(this._settings.thumbnailer.originalheight*this._settings.thumbnailer.scale)+"<br>"+
							"<br>Other parameters depend on the pages complexity. After grabbing the images you need to rename the image files leaving the page name only. You can automatically rename the image files running this oneliner from the thumbnails folder:<br><br><tt>"+this.htmlentities("ls -1 *.png|sed \"s/\\(.*_page_\\)\\(.*\\)/mv \\\"\\1\\2\\\" \\\"\\2\\\"/\"|sh")+"</tt><br><br>Then you can copy everything everywhere you like in your issue bundle (i.e. a <i>thumbs</i> directory)."+
							"<br><br><textarea style='width:100%;' rows=30>"+txt+"</textarea>"
							);
						break;
					}
					case "rasterizer": {
						var txt="<h1>Welcome to the rasterize tool!</h1>"+
						"This tool will try to help you on rasterizing your web pages to images in order to make slower pages faster.<br>"+
						"The main idea is to create an image for some of the magazine pages (or all of them) instead of having HTML. Though HTML version of the pages is very flexible, allowing a very wide set of layout alignment and adaptions, it could need some calculations that could produce a slow navigation of the magazine on slower devices.<br>"+
						"Showing just an image of the page is surely less resources-hungry and offers a smoother navigation but <b>it avoids your pages to adapt to the device screen size</b>. That's why I suggest you to rasterize just the pages that are too complex, in order to keep compatibility.<br>"+
						"On the contrary, if you're going to support just one device or - better - just one resolution, rasterizing everything will ensure the smoothest navigation on that device.<br>"+
						"Pages will be rendered <b>without any widget</b> and <b>without any object marked with the attribute dontrasterize=yes</b> so, in order to keep the interactive part of the magazine, <b>you must add again the interactive objects over the page image</b> is needed. For that reason I suggest you to keep all dynamic elements on a separated template, usable both in the HTML version and the rasterized one maintaining the same positions. A <i>templates</i> entry, with the <b>dontrasterize:true</b> property set, will be kept as is while rasterizing and will be shown in overlay on the resulting page, so is really handy in these cases.<br>"+
						"You also can disable rasterization of whole pages in the <i>data</i> section, specifying the <b>dontrasterize:true</b> attribute to JSON structure of the page. (i.e. for whole dynamic pages). If these pages are included into the rasterization phase, it will be kept as is.<br>"+
						"If you want to include some pages in the <i>data</i> section that are not related with the magazine index into the rasterized version (i.e. modal pages), assign the <b>keeponrasterized:true</b> attribute to that pages in order to copy them on the rasterized magazine.<br>"+
						"After creating the images of your pages, you have to update your <i>issue.js</i> file accordingly, adding the rasterized pages in the <i>data</i> sections and adding/replacing the HTML version with the new one. A sample <i>issue.js</i> will be generated and can be used as is in most of the cases.<br><br>";
						if (!this.geturlparameter("device")) {
							txt+="First setup the rasterization parameters.<br><br>";
							for (var v in this._magazine.versions) {
								txt+="<b>Version "+v+"</b><ul>";
								for (var s in this._magazine.versions[v].articles) {
									txt+="<li><select id='"+v+"-"+s+"'>";
									txt+="<option value=''>Exclude</option>";
									txt+="<option value='c'>Copy</option>";
									txt+="<option value='r'>Rasterize</option>";
									txt+="</select> Section "+s+"</li>";
								}
								txt+="</ul>";
							}
							txt+="<input type='button' onclick='browse.rasterizersetall(0)' value='Exclude all'> <input type='button' onclick='browse.rasterizersetall(1)' value='Copy all'> <input type='button' onclick='browse.rasterizersetall(2)' value='Rasterize all'><br><br>";
							txt+="<b>Device: <select id='resolution'>";
							for (var i=0;i<this._settings.devices.length;i++)
								txt+="<option value='device="+i+"'>"+this._settings.devices[i].label+"</option>"
							txt+="</select><br><br>";
							txt+="<input type=button value='Start' onclick=\"browse.rasterizerstart()\">";
						} else {
						
						
							txt+="Here they are some stuff thant can help you on making the rasterized version of your pages, from page URLs to the page stills with the right resolution to a precomposed issue.js file - you probably have to change something manually. You can use the Firefox plugin <a style='color:white' href='https://addons.mozilla.org/en-US/firefox/addon/7800/'>Grab Them All</a> (sources <a style='color:white' href='http://code.google.com/p/grabthemall/'>here</a>) for making the screenshots automatically. You need to split the image generation phase in two (for landscape and portrait) and change your grabbing settings accordingly to the plugin settings.<br><br>";
							var device=this._settings.devices[this.geturlparameter("device")*1];
							
							var returnmagazine={
								// Copies the magazine metadata
								metadata:this._magazine.metadata,
								templates:{},
								versions:{},
								data:{},
								version:[],
								_aliases:{
									pagemapping:{}
								}
							}
							
							// Prepare the magazine version. Set the rasterized versions
							for (var i in this._magazine.version) {
								var cv=this._magazine.version[i];
							}
							
							var file="";
							var tmpl;
							var tmpr;
							var ftmpl;
							var ftmpr;
							var pagearchive={portrait:{},landscape:{},rasterized:{}};

							for (var v in this._magazine.versions)
								for (var s in this._magazine.versions[v].articles) {
									var mode=this.geturlparameter(v+"-"+s);
									if (mode) {
										if (!returnmagazine.versions[v]) {
											returnmagazine.versions[v]={articles:{}};
											if (mode=="r") { // Add the rasterized version detection statement to the versions
												returnmagazine.version.push({sizeis:{width:device.landscape.width,height:device.landscape.height},id:v});
												returnmagazine.version.push({sizeis:{width:device.portrait.width,height:device.portrait.height},id:v});
												pagearchive.rasterized[v]=true;
											}
											for (var a in this._magazine.versions[v])
												if (!returnmagazine.versions[v][a]) returnmagazine.versions[v][a]=this._magazine.versions[v][a];
										}
										returnmagazine.versions[v].articles[s]=this._magazine.versions[v].articles[s];
										for (var a in this._magazine.versions[v].articles[s]) {
											for (var p in this._magazine.versions[v].articles[s][a].pages) {
												var page=this._magazine.versions[v].articles[s][a].pages[p];
												var rasterize=false;
												if (page.landscape) tmpl=page.landscape;
												if (page.portrait) tmpp=page.portrait;
												if (page.substr) {
													tmpl=page;
													tmpp=page;
												}
												if (this._magazine.data[tmpl].scrollpage||this._magazine.data[tmpl].dontrasterize||(mode=="c")) {
													this.mergepagedata(tmpl,returnmagazine.templates);
													returnmagazine.data[tmpl]=this._magazine.data[tmpl];
													ftmpl=tmpl;
												} else {
													ftmpl=this.makerasterizedpagedata(returnmagazine,"rst_lnd_",tmpl);
													returnmagazine._aliases.pagemapping[ftmpl]=tmpl;
													pagearchive.landscape[tmpl]=true;
												}
												if (this._magazine.data[tmpp].scrollpage||this._magazine.data[tmpp].dontrasterize||(mode=="c")) {
													this.mergepagedata(tmpp,returnmagazine.templates);
													returnmagazine.data[tmpp]=this._magazine.data[tmpp];
													ftmpp=tmpp;
												} else {
													ftmpp=this.makerasterizedpagedata(returnmagazine,"rst_prt_",tmpp);
													returnmagazine._aliases.pagemapping[ftmpp]=tmpp;
													pagearchive.portrait[tmpp]=true;
												}
												if (mode=="r") {
													returnmagazine._aliases.pagemapping[tmpl]={landscape:ftmpl,portrait:ftmpp};
													returnmagazine._aliases.pagemapping[tmpp]={landscape:ftmpl,portrait:ftmpp};													
													returnmagazine.versions[v].articles[s][a].pages[p]={landscape:ftmpl,portrait:ftmpp};
												}
											}
										}
									}
								}
							
							// Merge the version conditions of the unrasterized version
							for (var i=0;i<this._magazine.version.length;i++) {
								var cv=this._magazine.version[i];
								if (returnmagazine.versions[cv.id]&&!pagearchive.rasterized[cv.id]) returnmagazine.version.push(cv);
							}
							
							// Add the keeponrasterized pages to the rasterized version.
							for (var i in this._magazine.data) {
								var cd=this._magazine.data[i];
								if (cd.keeponrasterized) {
									this.mergepagedata(i,returnmagazine.templates);
									returnmagazine.data[i]=cd;
								}
							}
							
							// Prepare output
							file="\/\/ ---\n\/\/ This issue file has been generated by "+this._settings.toolname+" rasterizer.\n\/\/ ---\n\n";
							
							file+="\/\/ Stylesheets\n\n";
							for (var i=0;i<this._recorder.css.length;i++)
								file+="browse.addcss(\""+this.quoteentities(this._recorder.css[i])+"\");\n";

							file+="\n\/\/ Plugins\n\n";
							for (var i=0;i<this._recorder.plugin.length;i++)
								file+="browse.addplugin(\""+this.quoteentities(this._recorder.plugin[i])+"\");\n";

							file+="\n\/\/ JS\n\n";
							for (var i=0;i<this._recorder.js.length;i++)
								file+="browse.addjs(\""+this.quoteentities(this._recorder.js[i])+"\");\n";
							
							file+="\n\/\/ Magazine data\n\n";
							
							for (var a in returnmagazine) {
								file+="browse._magazine."+a+"="+this.serializer(returnmagazine[a])+";\n\n";
							}
						
							txt+="A sample <b>issue.js</b>. Should work as-is but you probably have to change something for handling fallbacks on magazine versions.<br><br><textarea style='width:100%;' rows=30>"+file+"</textarea>";
							
							txt+="<br><br><b>Landscape pages URLs</b>, to be used with Grab Them All. Set your grabbed area to "+device.landscape.width+" x "+device.landscape.height+", save these links on a text file and start processing.<br><br><textarea style='width:100%;' rows=30>";
							for (var i in pagearchive.landscape)
								txt+=document.location.href.replace(/\?.*/,"")+"?tool=showpage&nowidgets=yes&width="+device.landscape.width+"&height="+device.landscape.height+"&page="+i+"&nameto=rst_lnd_"+i+"\n";
							txt+="</textarea>";

							txt+="<br><br><b>Portrait pages URLs</b>, to be used with Grab Them All. Set your grabbed area to "+device.portrait.width+" x "+device.portrait.height+", save these links on a text file and start processing.<br><br><textarea style='width:100%;' rows=30>";
							for (var i in pagearchive.portrait)
								txt+=document.location.href.replace(/\?.*/,"")+"?tool=showpage&nowidgets=yes&width="+device.portrait.width+"&height="+device.portrait.height+"&page="+i+"&nameto=rst_prt_"+i+"\n";
							txt+="</textarea>";
							
							txt+="<br><br>After all the rasterized pages have been saved, run this line from your your output folder:<br><br><tt>";
							txt+=this.htmlentities("ls -1 *.png|sed \"s/\\(.*_nameto_\\)\\(.*\\)/mv \\\"\\1\\2\\\" \\\"\\2\\\"/\"|sh");
							txt+="</tt><br><br>and move all the images to the \""+this._magazine.bundle+"/rasterized\" folder.";
						}
						this.fullscreenmessage(txt);
						break;
					}
					case "index": {
						var txt=this._magazine.metadata.title+" index:<br><ul>";
						for (var a in this._magazine.data)
							txt+="<li><b>"+a+"</b> [<a style='color:white' href='?tool=thumbnail&page="+a+"'>Thumbnail</a>] [<a style='color:white' href='?tool=showpage&page="+a+"'>Single page</a>]</li>";
						txt+="</ul>";
						this.fullscreenmessage(txt);
						break;
					}					
					default: { // Open magazine
						if (this._settings.tool=="boxmaker") {
							this._boxmaker.enabled=true;
							this.passivepopup(this._settings.passivepopups.boxmaker.ready);
							browse.addEventListener(window,"keyup",this.boxmakerkeyhandler);
						}
						if ((this._settings.tool=="thumbnail")||(this._settings.tool=="showpage")) { // Just a screenshot. Makes a magazine with one forced page.
							// Find a matching article
							var found={title:"Article title",subtitle:"Article subtitle",pages:[]};
							var showingpage=this.geturlparameter("page");
							var searchres=this.findpage(null,null,null,showingpage);
							if (searchres)  found=searchres.article;
							this._magazine.version=[{id:"thumbnail"}];
							this._magazine.versions["thumbnail"]={
								metadata:{dontsavepositions:true},
								sections:[{id:"section",label:"Section",title:"Section title",subtitle:"Section subtitle"}],
								articles:{ section:[found]}
							};
							this._magazine.versions["thumbnail"].articles["section"][0].pages=[showingpage]; // set just a page
						}

						// Create global objects (whatever is the version)
						this.makescrollbar(); // Creates the scrollbar elements
						this.makebullets(); // Creates the bullets

						// Construct and initialize data/gui
						this.decideversion(); // Decide the magazine version for the first time
						this.makepages(); // Make the pages
						this.makemodal(); // Make the modal screen
						this.makeshadowbox(); // Make the shadow box
						this.makegui(); // Creates the gui elements
						this.pagechanged(); // Set the page for the first time
						this.relayoutall(false); // Relayout all for the first time
		
		
						if (this._settings.tool!="thumbnail") // Just a screenshot
							this.applytouchevents(this._display,browse.__touchstart,browse.__touchmove,browse.__touchend,true); // Apply the raw events to the screen
		
						// Remove the loading screen
						
						this.objloaded();
						
					}
				}
				
				this.dismissloadingscreen();
				break;
			}
			default: {
				this._loadphase=1000;
				break;
			}
		}
	},
	rasterizerstart:function() {
		var url="&";	
		var idx;
		var vl;
		for (var v in this._magazine.versions)
			for (var s in this._magazine.versions[v].articles) {
				idx=v+"-"+s;
				vl=browse.getcombovalue(idx);
				if (vl) url+=idx+"="+vl+"&";
			}
		document.location.href+=url+browse.getcombovalue('resolution');
	},
	rasterizersetall:function(num) {
		var idx;
		for (var v in this._magazine.versions)
			for (var s in this._magazine.versions[v].articles) {
				idx=v+"-"+s;
				document.getElementById(idx).selectedIndex=num;
		}
	},
	
	// *********************
	// BOXMAKER TOOL
	// *********************
	boxmakeraddbox:function(box) {
		var pid=this._pagestack.topmostpage.pageid;
		if (!this._boxmaker.data[pid]) this._boxmaker.data[pid]=[];
		this._boxmaker.data[pid].push({x:box.x,y:box.y,w:box.w,h:box.h});
		browse.passivepopup({id:"boxmakerboxadded",text:"Box added to the page:<br><br><b>At:</b> "+box.x+","+box.y+"<br><b>Width:</b> "+box.w+"<br><b>Height:</b> "+box.h+"<br><br><b>Page:</b><br>"+pid,style:{backgroundColor:"#ffa0a0",color:"#000000"}});
	},
	boxmakerdeletebox:function(id) {
		this._boxmaker.boxeditor.currentdata=this._boxmaker.boxeditor.currentdata.splice(id,1);
		this.boxmakershoweditor();
	},
	boxmakershoweditor:function() {
		this.boxmakercanceleditor();
		this._boxmaker.editing=2;
		var pid=this._pagestack.topmostpage.pageid;
		this._boxmaker.boxeditor.currentdata=this._boxmaker.data[pid];
		if (!this._boxmaker.boxeditor.bg) {
			this._boxmaker.boxeditor.bg=document.createElement("div");
			this._boxmaker.boxeditor.bg.style.position="absolute";
			this._boxmaker.boxeditor.bg.style.zIndex=999999;
			this._boxmaker.boxeditor.bg.style.backgroundColor="#000000";
			this._boxmaker.boxeditor.bg.style.opacity=0.2;
			this._boxmaker.boxeditor.bg.style.left="0px";
			this._boxmaker.boxeditor.bg.style.top="0px";
			this._boxmaker.boxeditor.bg.style.width="100%";
			this._boxmaker.boxeditor.bg.style.height="100%";
			this.applytouchevents(this._boxmaker.boxeditor.bg,this.__touchstart,this.__touchmove,this.__touchend,true);
		}
		document.body.appendChild(this._boxmaker.boxeditor.bg);					
		this._boxmaker.boxeditor.boxes=[];
		if (this._boxmaker.data[pid])
			for (var a=0;a<this._boxmaker.data[pid].length;a++) {
				var bx=document.createElement("div");
				bx.style.position="absolute";
				bx.style.zIndex=1999999;
				bx.style.backgroundColor="#000000";
				bx.style.border="1px dashed #ff0000";
				bx.style.opacity=0.5;
				bx.style.left=this._boxmaker.data[pid][a].x+"px";
				bx.style.top=this._boxmaker.data[pid][a].y+"px";
				bx.style.width=(this._boxmaker.data[pid][a].w>2?this._boxmaker.data[pid][a].w-2:1)+"px";
				bx.style.height=(this._boxmaker.data[pid][a].h>2?this._boxmaker.data[pid][a].h-2:1)+"px";
				bx.setAttribute("boxid",a);
				this.applytouchevents(bx,this.__touchstart,this.__touchmove,this.__touchend,true);
				document.body.appendChild(bx);
				this._boxmaker.boxeditor.boxes.push(bx);
			}
	},
	boxmakercanceleditor:function() {
		if (this._boxmaker.editing==2) {
			if (this._boxmaker.boxeditor.bg) document.body.removeChild(this._boxmaker.boxeditor.bg);
			if (this._boxmaker.boxeditor.boxes)
				for (var a=0;a<this._boxmaker.boxeditor.boxes.length;a++) {
					document.body.removeChild(this._boxmaker.boxeditor.boxes[a]);
					delete this._boxmaker.boxeditor.boxes[a]
				}
			this._boxmaker.editing=0;
		}
	},
	boxmakerkeyhandler:function(e) {
		if (browse._boxmaker.currentrect)
			browse.passivepopup(browse._settings.passivepopups.boxmaker.dragging);
		else {
			switch (e.keyCode) {
				case 66: { // B (browse mode)
					browse.boxmakercanceleditor();
					browse._boxmaker.editing=0;
					browse.passivepopup(browse._settings.passivepopups.boxmaker.browse);
					break;
				}
				case 65: { // A (add mode)
					browse.boxmakercanceleditor();
					browse._boxmaker.editing=1;
					browse.passivepopup(browse._settings.passivepopups.boxmaker.add);
					break;
				}
				case 69: { // E (edit mode)
					if (browse._boxmaker.editing==2) {
						browse.boxmakercanceleditor();
						browse._boxmaker.editing=0;
						browse.passivepopup(browse._settings.passivepopups.boxmaker.browse);
					} else {
						browse.passivepopup({id:"boxmakerunbrowse",text:"Boxmaker in <b>edit mode</b>.<br>Click on boxes to delete.<br><br><b>Page:</b><br>"+browse._pagestack.topmostpage.pageid,style:{backgroundColor:"#ffa0a0",color:"#000000"}});
						browse.boxmakershoweditor();
					}
					break;
				}
				case 83: { // S (save)
					browse.boxmakercanceleditor();
					if (browse._boxmaker.editing==3) {
						var htmls={};
						for (var pg in browse._boxmaker.data) 
							if (browse._boxmaker.data[pg]&&browse._boxmaker.data[pg].length) {
								if (!browse._magazine.data[pg].template) browse._magazine.data[pg].template=[];
								browse._magazine.data[pg].template.push("boxmaker_"+pg);
								browse._magazine.templates["boxmaker_"+pg]={keeponrasterized:true,file:browse._magazine.bundle+"/boxmaker-"+pg+".html"};
								htmls[pg]="";
								for (var a=0;a<browse._boxmaker.data[pg].length;a++)
									htmls[pg]+="<div interactive=\"yes\" onobjecttap=\"browse.passivepopup({text:'Placeholder action!'})\" style=\"opacity:0.5;background-color:#ff0000;color:#ffffff;overflow:hidden;position:absolute;left:"+browse._boxmaker.data[pg][a].x+"px;top:"+browse._boxmaker.data[pg][a].y+"px;width:"+browse._boxmaker.data[pg][a].w+"px;height:"+browse._boxmaker.data[pg][a].h+"px;\">Box "+(a+1)+"</div>\n";
							}
						var txt="<h1>Welcome to the boxmaker save mode!</h1>";
						txt+="The boxes you've added to your magazine will be exported as translucent coloured DIVs with a defined default action on tap/click. You can change the action and remove the background color and opacity values to add invisible interactivity to your page or histance a plugin in it in order to add galleries and more interactive objects using the <tt>widget='widgetname'</tt> attribute.<br><br>";
						txt+="Replace these <i>browse._magazine</i> sections in your <tt>"+browse._magazine.bundle+"/issue.js</tt> file and create the next files as indicated.<br><br>";
						txt+="<b>Templates section:</b><br><textarea style='width:80%;' rows=30>browse._magazine.templates="+browse.serializer(browse._magazine.templates)+";</textarea><br>";
						txt+="<b>Data section:</b><br><textarea style='width:80%;' rows=30>browse._magazine.data="+browse.serializer(browse._magazine.data)+";</textarea><br>";
						for (var pg in htmls)
							txt+="<b>File "+browse._magazine.bundle+"/boxmaker-"+pg+".html"+"</b><br><textarea style='width:80%;' rows=30>"+htmls[pg]+"</textarea><br>";
						browse.fullscreenmessage(txt);
					} else {
						browse._boxmaker.editing=3;
						browse.passivepopup(browse._settings.passivepopups.boxmaker.save);
					}
					break;
				}
				default:{
					if (browse._boxmaker.editing==3) browse._boxmaker.editing=0;
					browse.boxmakercanceleditor();
					browse.passivepopup(browse._settings.passivepopups.boxmaker.quickhelp);
					break;
				}
			}
		}
	},
	
	
	// *********************
	// BENCHMARKING
	// *********************
	benchmarkended:function() {
		var now=new Date();
		var time=now-this._hardware.objs.started;
		var exp=(this._hardware.objs.cycles*10);
		var test=time-exp;
		var ended=(browse._hardware.objs.cycles==browse._hardware.objs.cycled);
		var passed=(test<=1500); // 1.5 of tollerance.
		if (ended||!passed) {
			this._hardware.passed=passed&&ended;
			if (!this._hardware.passed) { // Low speed renderer. Sorry. Setting low profile.
				this._hardware.boxshadow=null; 
			}
			return true;
		} else return false;
	},
	cyclebenchmark:function() {
		var sum=browse._hardware.objs.shadowtest.offsetWidth+browse._hardware.objs.shadowtest.offsetHeight;
		if (browse._hardware.objs.sum!=sum) {
			browse._hardware.objs.cycled++;
			browse._hardware.objs.sum=sum;
		}
		browse._hardware.objs.shadowtest.style.left=(10*Math.random())+"%";
		browse._hardware.objs.shadowtest.style.top=(10*Math.random())+"%";
		browse._hardware.objs.shadowtest.style.width=(10*Math.random())+"%";
		browse._hardware.objs.shadowtest.style.height=(10*Math.random())+"%";
		if (browse.benchmarkended())
			browse.endbenchmark();
		else
			setTimeout(browse.cyclebenchmark,1);
	},
	endbenchmark:function() {
		this._display.removeChild(this._hardware.objs.shadowtest);
		delete this._hardware.objs;
		this.doloadphase();
	},
	benchmark:function(skip) {
		var s = document.body.style;	
		// Detect CSS transform
		if (s.transform !== undefined) this._hardware.transform={js:"transform",style:"transform"}; else
		if (s.WebkitTransform !== undefined) this._hardware.transform={js:"WebkitTransform",style:"-webkit-transform"}; else
		if (s.MozTransform !== undefined) this._hardware.transform={js:"MozTransform",style:"-moz-transform"};
		if (s.OTransform !== undefined) this._hardware.transform={js:"OTransform",style:"-o-transform"}; // Opera translations are slower than moving?
		
		// Detect CSS BoxShadow	
		if (s.boxShadow !== undefined) this._hardware.boxshadow={js:"boxShadow",style:"box-shadow"}; else
		if (s.WebkitBoxShadow !== undefined) this._hardware.boxshadow={js:"WebkitBoxShadow",style:"-webkit-box-shadow"}; else
		if (s.MozBoxShadow !== undefined) this._hardware.boxshadow={js:"MozBoxShadow",style:"-moz-box-shadow"}; else
		if (s.OBoxShadow !== undefined) this._hardware.boxshadow={js:"OBoxShadow",style:"-o-box-shadow"};		

		// Detect CSS BorderRadius	
		if (s.borderRadius !== undefined) this._hardware.borderradius={js:"borderRadius",style:"border-radius"}; else
		if (s.WebkitBorderRadius !== undefined) this._hardware.borderradius={js:"WebkitBorderRadius",style:"-webkit-border-radius"}; else
		if (s.MozBorderRadius !== undefined) this._hardware.borderradius={js:"MozBorderRadius",style:"-moz-border-radius"}; else
		if (s.OBorderRadius !== undefined) this._hardware.borderradius={js:"OBorderRadius",style:"-o-border-radius"};

		// Detect CSS Backface-visibility	
		if (s.transitionProperty !== undefined) this._hardware.transitionproperty={js:"transitionProperty",style:"transition-property"}; else
		if (s.WebkitTransitionProperty !== undefined) this._hardware.transitionproperty={js:"WebkitTransitionProperty",style:"-webkit-transition-property"}; else
		if (s.MozTransitionProperty !== undefined) this._hardware.transitionproperty={js:"MozTransitionProperty",style:"-moz-transition-property"}; else
		if (s.OTransitionProperty !== undefined) this._hardware.transitionproperty={js:"OTransitionProperty",style:"-o-transition-property"};

		// Detect CSS Backface-visibility	
		if (s.backfaceVisibility !== undefined) this._hardware.backfacevisibility={js:"backfaceVisibility",style:"backface-visibility"}; else
		if (s.WebkitBackfaceVisibility !== undefined) this._hardware.backfacevisibility={js:"WebkitBackfaceVisibility",style:"-webkit-backface-visibility"}; else
		if (s.MozBackfaceVisibility !== undefined) this._hardware.backfacevisibility={js:"MozBackfaceVisibility",style:"-moz-backface-visibility"}; else
		if (s.OBackfaceVisibility !== undefined) this._hardware.backfacevisibility={js:"OBackfaceVisibility",style:"-o-backface-visibility"};
		
		// Detect touch device
		var el = document.createElement('div');
		el.setAttribute('ontouchstart', 'return;');
		this._hardware.touchenabled=(typeof el.ontouchstart == "function");
	
		this._hardware.uselocalstorage=this._settings.uselocalstorage;
		if (this._hardware.uselocalstorage&&((!window["localStorage"])||(window.location.protocol=="file:"))) this._hardware.uselocalstorage=false;		

		if (skip)
			this.doloadphase();
		else {
			
			this._hardware.objs={cycles:100,cycled:0,sum:-1,started:new Date(),shadowtest:null};
			this._hardware.objs.shadowtest=document.createElement("div");
			this._hardware.objs.shadowtest.style.position="absolute";
			this._hardware.objs.shadowtest.style.zIndex=0;
			this._hardware.objs.shadowtest.style.height="30%";
			this._hardware.objs.shadowtest.style.width="30%";
			this._hardware.objs.shadowtest.style.zIndex=10001;		
			this._hardware.objs.shadowtest.style.backgroundColor="black";
			if (this._hardware.boxshadow)
				this._hardware.objs.shadowtest.style[this._hardware.boxshadow.js]="8px 8px 8px #000";
			this._hardware.objs.shadowtest.style.color="#000000";
			this._hardware.objs.shadowtest.innerHTML="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ullamcorper posuere tristique. Nulla bibendum risus a tellus condimentum mattis. Etiam vestibulum felis at mi consectetur fringilla. Donec quis augue non nibh porttitor porta quis nec nisl. Vivamus at mauris orci. Cras bibendum porta consequat. Vestibulum eget semper nisi. Vivamus lorem lectus, congue sit amet semper ut, egestas nec nisi. Mauris eu placerat libero. Pellentesque in dui turpis, a consequat eros. Etiam convallis est quis turpis bibendum eu gravida massa euismod. Proin in odio dui, sed rhoncus quam. Phasellus luctus, felis ut rutrum tristique, libero velit vehicula mauris, condimentum consectetur ipsum leo iaculis ipsum. Phasellus tempus est non enim pharetra mollis. Quisque quis nulla quis tellus suscipit auctor quis in nulla. Curabitur facilisis aliquet velit in rutrum. Fusce placerat consectetur enim, in volutpat odio aliquam nec. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ullamcorper posuere tristique. Nulla bibendum risus a tellus condimentum mattis. Etiam vestibulum felis at mi consectetur fringilla. Donec quis augue non nibh porttitor porta quis nec nisl. Vivamus at mauris orci. Cras bibendum porta consequat. Vestibulum eget semper nisi. Vivamus lorem lectus, congue sit amet semper ut, egestas nec nisi. Mauris eu placerat libero. Pellentesque in dui turpis, a consequat eros. Etiam convallis est quis turpis bibendum eu gravida massa euismod. Proin in odio dui, sed rhoncus quam. Phasellus luctus, felis ut rutrum tristique, libero velit vehicula mauris, condimentum consectetur ipsum leo iaculis ipsum. Phasellus tempus est non enim pharetra mollis. Quisque quis nulla quis tellus suscipit auctor quis in nulla. Curabitur facilisis aliquet velit in rutrum. Fusce placerat consectetur enim, in volutpat odio aliquam nec. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ullamcorper posuere tristique. Nulla bibendum risus a tellus condimentum mattis. Etiam vestibulum felis at mi consectetur fringilla. Donec quis augue non nibh porttitor porta quis nec nisl. Vivamus at mauris orci. Cras bibendum porta consequat. Vestibulum eget semper nisi. Vivamus lorem lectus, congue sit amet semper ut, egestas nec nisi. Mauris eu placerat libero. Pellentesque in dui turpis, a consequat eros. Etiam convallis est quis turpis bibendum eu gravida massa euismod. Proin in odio dui, sed rhoncus quam. Phasellus luctus, felis ut rutrum tristique, libero velit vehicula mauris, condimentum consectetur ipsum leo iaculis ipsum. Phasellus tempus est non enim pharetra mollis. Quisque quis nulla quis tellus suscipit auctor quis in nulla. Curabitur facilisis aliquet velit in rutrum. Fusce placerat consectetur enim, in volutpat odio aliquam nec.";
			this._display.appendChild(this._hardware.objs.shadowtest);
			
			this.cyclebenchmark();
		}
	},
	
	// *********************
	// PASSIVE POPUP
	// *********************
	passivepopuptoggle:function() {
		browse._passivepopup.obj.style.display="none";
	},
	passivepopup:function(state) {
		if (browse._settings.enablepassivepopups) {
			if (!state) state=browse._passivepopup.state;
			if (state&&!state.ignore) {
				browse._passivepopup.state=state;
				if (browse._passivepopup.obj) {
					if (state.text) {
						browse._passivepopup.obj.style.display="block";			
						browse._passivepopup.obj.innerHTML=state.text;
						if (browse._passivepopup.tout) clearTimeout(browse._passivepopup.tout);
						if (!state.keep) browse._passivepopup.tout=setTimeout(browse.passivepopuptoggle,(state.time?state.time:2000));
						if (state.onshow) state.onshow();
						if (state.style) for (a in state.style) browse._passivepopup.obj.style[a]=state.style[a];
					} else
						browse._passivepopup.obj.style.display="none";
				}	
			}
		}
	},
	passivepopupclicked:function() {
		if (browse._passivepopup.state.onclick) browse._passivepopup.state.onclick();
	},
	
	// *********************
	// MAIN EVENTS
	// *********************
	dismissloadingscreen:function() {
		browse._loadingscreen.time-=0.1;
		browse._loadingscreen.obj.style.opacity=(browse._loadingscreen.time>1?1:browse._loadingscreen.time);
		if (browse._loadingscreen.time<=0) {
			browse._display.removeChild(browse._loadingscreen.obj);
			browse._loadingscreen=null;
		} else setTimeout(browse.dismissloadingscreen,10);
	},	
	resize:function() {
		if (this._boxmaker.enabled) this.boxmakercanceleditor();
		if (!this._display||(this._loadphase!=1000)) return;
		this._width=this._display.offsetWidth; 
		this._height=this._display.offsetHeight;
		this.decideversion(); // Decide the magazine version after resizing.
		this.relayoutall(true); // Resize all the gui elements
	},
	restorecurrentpage:function() {
		var chunk=this.loadsetting(true,"currentpage");
		var jumped=false;
		if (chunk) {
			chunk=chunk.split("|");
			if ((chunk[0]==this._magazine.metadata.version)&&(chunk[1]==this._current.magazineversionid)) { // Validate the saved magazine and version
				this.jumpto(chunk[2],parseInt(chunk[3]),parseInt(chunk[4]));
				jumped=true;
			}
		}
		if (!jumped) // Go at start of the first section of the current version
			this.jumpto(this._magazine.versions[this._current.magazineversionid].sections[0].id,0,0);
	},
	savecurrentpage:function() {
		if (!this._current.magazineversion.metadata.dontsavepositions)
			this.savesetting(true,"currentpage",this._magazine.metadata.version+"|"+this._current.magazineversionid+"|"+this._current.sectionid+"|"+this._current.horizontal+"|"+this._current.vertical);
	},
	offlineevent:function(e) {
		var state=null;
		if (e&&e.type)
			if (navigator.onLine) {
				if ((e.type=="error")&&(navigator.standalone))
					state=browse._settings.passivepopups.offlinestorageonline["errorbm"];
				else
					state=browse._settings.passivepopups.offlinestorageonline[e.type];
			} else
				state=browse._settings.passivepopups.offlinestorageoffline[e.type];
		if (browse._settings.debug>0) console.log("New state:["+e.type+","+window.applicationCache.status+"]",state);
		browse.passivepopup(state);
	},

	init:function(disp,bundle,altfile) {
		// Get alternative main file name
		if (altfile) this._magazine.bundlefile=altfile;
		// Attach to events.
		this.addEventListener(window,"load",function(){browse._init(disp,bundle);});
		this.addEventListener(window,"resize",function(){browse.resize();});
		if (window.applicationCache) {
			this.addEventListener(window.applicationCache,'cached', this.offlineevent);
			this.addEventListener(window.applicationCache,'checking', this.offlineevent);
			this.addEventListener(window.applicationCache,'downloading', this.offlineevent);
			this.addEventListener(window.applicationCache,'error', this.offlineevent);
			this.addEventListener(window.applicationCache,'noupdate', this.offlineevent);
			this.addEventListener(window.applicationCache,'obsolete', this.offlineevent);
			this.addEventListener(window.applicationCache,'progress', this.offlineevent);
			this.addEventListener(window.applicationCache,'updateready', this.offlineevent);
		}
	},
	_init:function(disp,bundle) {

		document.title="Welcome to "+this._settings.toolname+".";
		
		// Prepare the document body
		document.body.style.WebkitTextSizeAdjust="none";
		document.body.style.WebkitUserSelect="none";
		document.body.style.MozUserSelect="none";
		document.body.style.WebkitTouchCallout="none";
		document.body.style.WebkitTapHighlightColor="rgba(0,0,0,0)";


		document.body.style.cursor="pointer";
		document.body.style.margin=0;
		
		// Prepare the container
		this._display=document.getElementById(disp);
		this._display.style.overflow="hidden";
		
		// Prepare the loading screen
		this._loadingscreen.obj=document.createElement("div");
		this._loadingscreen.obj.style.position="absolute";
		this._loadingscreen.obj.className="loadingscreen";
		this._loadingscreen.obj.id="_loadingscreen";
		this._loadingscreen.obj.style.zIndex=10000;
		this._loadingscreen.obj.style.left=0;
		this._loadingscreen.obj.style.top=0;
		this._loadingscreen.obj.style.width="100%";
		this._loadingscreen.obj.style.height="100%";
		this._loadingscreen.obj.style.background="#000000 url('libs/spinner.gif') no-repeat scroll center";
		this._display.appendChild(this._loadingscreen.obj);
		
		// Add the passivepopup.
		this._passivepopup.obj=document.createElement("div");
		this._passivepopup.obj.style.display="none";
		this._passivepopup.obj.style.position="absolute";
		this._passivepopup.obj.style.right="5px";
		this._passivepopup.obj.style.top="5px";
		this._passivepopup.obj.style.fontFamily="helvetica";
		this._passivepopup.obj.style.zIndex=10001;
		this._passivepopup.obj.style.padding="5px";
		this._passivepopup.obj.style.backgroundColor="red";
		this._passivepopup.obj.style.fontSize="10px";
		this._passivepopup.obj.style.border="1px solid #000000";
		this.applytouchevents(this._passivepopup.obj,null,null,this.passivepopupclicked,true);
		this._display.appendChild(this._passivepopup.obj);
		

		this._magazine.bundle=bundle;
		
		// Start action

		this._settings.tool=(this._settings.enabletools?this.geturlparameter("tool"):null);
		if (this.geturlparameter("skipdelays")) this._settings.skipdelays=this.geturlparameter("skipdelays");
		if (this.geturlparameter("nowidgets")) this._settings.nowidgets=this.geturlparameter("nowidgets");
		
		if (this._settings.tool=="help") {
			this.fullscreenmessage(
				"<h1>Welcome to the "+this._settings.toolname+" tools help!</h1>"+
				"<tt><a style='color:white' href='?skipdelays=yes'>skipdelays=yes</a></tt> For skipping delays while loading or opening modals. Useful while developing and designing pages ;)<br>"+
				"<tt><a style='color:white' href='?tool=help'>tool=help</a></tt> For this guide.<br>"+
				"<tt><a style='color:white' href='?tool=offline'>tool=offline</a></tt> For instructions to make your magazine readable offline.<br>"+
				"<tt><a style='color:white' href='?tool=rasterizer'>tool=rasterize</a></tt> For instructions to rasterize all your magazine pages in order to make it faster but specialized on a specific device.<br>"+
				"<tt><a style='color:white' href='?tool=thumbnailer'>tool=thumbnailer</a></tt> For instructions to make page thumbnails to be used in your magazine (tipically in the index).<br>"+
				"<tt><a style='color:white' href='?tool=index'>tool=index</a></tt> Creates an handy index for developers/designers. There are mainly shortcuts for the parameters below.<br>"+
				"<tt><a style='color:white' href='?tool=boxmaker'>tool=boxmaker</a></tt> Enables the boxmaker tool that can help on creating the widget overlay on your rasterized pages. You can read a quick quide <a style='color:white' href='?tool=boxmakerhelp'>here</a>.<br>"+
				"<tt>tool=thumbnail&page=<i>[page id]</i></tt> For the <i>page id</i> thumbnail image. To be used with <i>thumbnailer</i> tool.<br>"+
				"<tt>tool=showpage&page=<i>[page id]</i></tt> Shows only <i>page id</i>, without the rest of the magazine.<br>"+
				"<br><hr><i>"+this._settings.toolname+"</i> is "+this._settings.toollicense+" licensed. &copy;2011 KesieV - <a style='color:white' href='http://www.kesiev.com'>http://www.kesiev.com</a>"
			);
		} else if (this._settings.tool=="boxmakerhelp") {
			this.fullscreenmessage(
				"<h1>Welcome to the boxmaker tool help!</h1>"+
				"<i>boxmaker</i> is a tool that can help you on making an interactive overlay for your rasterized magazine.<br>The concept behind interactive layers is pretty simple. Magaka can stack many HTML files and images one "+
				"over another one and the result is shown to the user. If you've just an image of your magazine page, you can put an invisible layer with interactive widgets over that image, defining some <i>sensible areas</i> that "+
				"can be used for many purposes, like showing widgets or making links between pages.<br><br>"+
				"I suggest to start working with <i>boxmaker</i> when your whole magazine is already readable on Magaka, so your <i>index.html</i> file and the <i>issue.js</i> file are ready. Moreover is easier to work with <i>boxmaker</i> on a browser view that have the same size of your exported images so another suggestion is to use <i>boxmaker</i> into the <i>Device Tester</i> tool included in Magaka. You can open the <i>boxmaker</i> tool pointing to your <i>index.html</i> file and appending the <a style='color:#ffffff' href='?tool=boxmaker'>?tool=boxmaker</a> parameter (just make sure that tools has been enabled from settings).<br>"+
				"Your magazine will be opened on the browser as usual but some keyboard commands will be enabled.<ul>"+
				"<li><b>A</b> key: <i>add mode</i>. Add a new box on the current page. To create a box just drag and drop with your mouse - a dashed rectangle will show the selected area. After dropping, the box becomes invisible and is added to the page.</li>"+
				"<li><b>E</b> key: <i>edit mode</i>. Shows the rectange defined in the current page. Click a rectangle to delete it. Hit any key to exit the <i>edit mode</i>.</li>"+
				"<li><b>B</b> key: <i>browse mode</i>. The editor is disabled so you can navigate to another page. Once reached the page you want to delete, just hit the A or E key.</li>"+
				"<li><b>S</b> key: <i>save mode</i>. Hitting the S key twice, the boxmaker tool is closed and some chuncks of code are generated. Just follow the on-screen instructions to apply the defined boxes to your magazine.</li>"+
				"</ul>"+
				"The code generated by the <i>save mode</i> includes some parts to be replaced to your <i>issue.js</i> file and a bunch of new HTML files to be created. The created files will be used to show some translucent coloured and numbered DIVs over the already existing rasterized pages with a predefined action performed when tapped/clicked and at the same position you've defined into the boxmaker tool. After that you can change any of the rectangles behaviour, removing background colour, opacity and text and making them invisible but still clickable or assigning a widget on that area, in order to add interactive elements like blackboards and slideshows.<br>"+
				"You will be able to change the boxes left, top, width and height attributes if you need to do some fine tuning. I suggest you to use the <a style='color:#ffffff' href='?tool=index'>index tool</a> for progressively seeing your changes quicker."
			);
		} else {
		
			if (this._settings.tool||this._settings.skipdelays) {
				this._loadingscreen.time=0;
				this.benchmark(true); // Skips benchmark directly
			} else {
				this._loadingscreen.time=this._settings.loadingscreen.delay;		
				this.benchmark(); // Starts the benchmark
			}
			
		}
		
	},
	// ---
	// Logical layout reset
	// ---
	adjustscrollablepages:function() {
		if (this._current.pagedata&&this._current.pagedata.scrollpage) // Changes vertical scrolling on scrollable pages
			if (-this._yscroll-this._baseyscroll+this._height>this._currentpage.obj.offsetHeight) {
				this._baseyscroll=-this._currentpage.obj.offsetHeight+this._height;
				this._yscroll=0;
				return true;
			}
		return false;
	},
	relayoutall:function(resized) {
	
		this.updatecurrent(); // Updates the new current page references, if changed after rotating/relayout

		// Resize the viewer pages
		this.resizepage(this._firstpage,resized);
		this.resizepage(this._currentpage,resized);
		this.resizepage(this._nextpage,resized);
		this.resizepage(this._upperpage,resized);
		this.resizepage(this._lowerpage,resized);
		this.updatepage(this._currentpage); // Update the center page.
		this.setcontenttopages(); // Set content when the page changed for the new hidden pages.
		this.adjustscrollablepages(); // Avoid that part of the browser background is shown after resizing a scrollable page
		this.layoutpages();	// Relayout pages when resizing
		
		// Resize the modal box, if displayed
		if (this._modalbox.displayed) {
			this.resizepage(this._modalbox,resized);
			this.setcontenttomodal(); // Change the content according to the orientation
			this.updatepage(browse._modalbox); // Update the modal page, if changed
			// Scrolling pages are not allowed as modal so is not needed to relayout them
			this.layoutmodal(); // Relayout page when resizing
		}
		
		// Relayout GUI elements
		this.layoutbullets(); // Layout the bullet if decideversion changed
		this.layoutgui(); // Relayout gui when resizing
		this.updategui(); // Relayout the GUI, if needed. For placeholders
	},	
	
	// *********************
	// WIDGET & API
	// *********************
	gotosheet:function(sect,horz,vert) {
		if (this.isbrowseridle()) {
			var resetvert=false;
			if (sect==null) sect=this._current.sectionid;
			if (sect!=this._current.sectionid) resetvert=true;
			if (horz=="right") horz=this._current.horizontal+1; else
			if (horz=="left") horz=this._current.horizontal-1; else
			if (horz=="top") horz=0; else
			if (horz=="bottom") horz=this._current.magazineversion.articles[sect].length-1;
			if (horz!=null) {
				if (horz<0) horz=0; else
				if (horz>this._current.magazineversion.articles[sect].length-1) horz=this._current.magazineversion.articles[sect].length-1;
			} else horz=this._current.horizontal;
			if (vert=="up") vert=(resetvert?1:this.getvert(horz))-1; else
			if (vert=="down") vert=(resetvert?-1:this.getvert(horz))+1; else
			if (vert=="top") vert=0; else
			if (vert=="bottom") vert=this._current.magazineversion.articles[sect][horz].pages.length-1;
			if (vert!=null) {
				if (vert<0) vert=0;
				if (vert>this._current.magazineversion.articles[sect][horz].pages.length-1) vert=this._magazine.versions[this._current.magazineversionid].articles[sect][horz].pages.length-1;
			} else vert=(resetvert?0:this.getvert(horz));
			this._travel={horizontal:horz,vertical:vert,sectionid:sect};
			this.starttravel();
		}
	},
	gotopage:function(sect,page) {
		page=this.solvepagealias(page);
		var searchres=this.findpage(this._current.magazineversionid,sect,null,page);
		if (searchres) this.gotosheet(sect,searchres.horizontal,searchres.vertical);
	},
	
	// *********************
	// ALIAS LOGICS
	// *********************
	
	solvepagealias:function(name) {
		if (browse._magazine._aliases) {
			var als=browse._magazine._aliases.pagemapping[name];
			if (!als) return name; else
			if (als.substr) return als; else
			if (als.landscape&&this.islandscape()) return als.landscape; else
			if (als.portrait&&!this.islandscape()) return als.portrait; else
			return name;
		} else return name;
	},

	// *********************
	// UTILS
	// *********************
	reloadmagazine:function() {
		document.location.href=document.location.href;
	},
	addheadlink:function(p) {
		var hd=document.createElement("link");
		for (var a in p) hd.setAttribute(a,p[a]);
		document.getElementsByTagName("head")[0].appendChild(hd);
	},
	quoteentities:function(fn) {
		return fn.replace(/"/g,"\\\"").replace(/\n/g,"\\n").replace(/\r/g,"\\r");
	},
	serializer:function(s,pref) {
		pref=(pref?pref:"");
		var npref=pref+"\t";
		var ret="";
		var t = typeof (s);
		if (s==null)
			ret="null";
		else if (t=="string")
			ret='"'+this.quoteentities(s)+'"';
		else if (t=="number")
			ret=s;
		else if (t=="boolean")
			ret=(s?"true":"false");
		else if (t=="function")
			ret=s;
		else {
			var dta;
			var cnt;
			if (s.constructor == Array)  dta=[true,"[","]"]; else dta=[false,"{","}"];
			var cnt=0;
			var out;
			var tret=dta[1]+"\n";
			for (var i in s) {
				cnt++;
				out=(dta[0]?"":i+":")+browse.serializer(s[i],npref);
				tret+=npref+out+",\n";
			}
			if (cnt==0)
				ret=dta[1]+dta[2];
			else if (cnt==1)
				ret=dta[1]+out+dta[2];
			else
				ret=tret.substr(0,tret.length-2)+"\n"+pref+dta[2];
		}
		return ret;
	},
	findpage:function(version,section,article,searchedpage) { // Find a matching article. use "null" for any.
		var found=false;
		for (var v in this._magazine.versions) {
			if ((v==version)||(version==undefined))
				for (var s in this._magazine.versions[v].articles) {
					if ((s==section)||(section==undefined))
						for (var a in this._magazine.versions[v].articles[s]) {
							if ((this._magazine.versions[v].articles[s][a].title==article)||(article==undefined))
								for (var p in this._magazine.versions[v].articles[s][a].pages) {
									var page=this._magazine.versions[v].articles[s][a].pages[p];
									if ((page==searchedpage)||(page.portrait&&page.portrait==searchedpage)||(page.landscape&&page.landscape==searchedpage)) {
										found={horizontal:a*1,vertical:p*1,idversion:v,idsection:s,article:this._magazine.versions[v].articles[s][a]};
										break;
									}
								}
								if (found) break;
						}
						if (found) break;
					}
			if (found) break;
		}
		return found;
	},
	makerasterizedpagedata:function(returnmagazine,prefix,data) {
		var id=prefix+data;
		returnmagazine.data[id]={image:this._magazine.bundle+"/rasterized/"+id+".png"};
		var includedlayers=this.mergepagedata(data,returnmagazine.templates,true);
		if (includedlayers.length) { // If there is some layer on the rasterized version too...
			returnmagazine.data[id].template=includedlayers; // Add them...
			// And merges the other attributes
			for (var a in this._magazine.data[data])
				if (!returnmagazine.data[id][a]) returnmagazine.data[id][a]=this._magazine.data[data][a];
		}
		return id;
	},
	mergepagedata:function(pdata,templatelist,onlykeeponrasterized) {
		var ret=[];
		if (this._magazine.data[pdata].template)
			for (var i=0;i<this._magazine.data[pdata].template.length;i++) {
				var tmpn=this._magazine.data[pdata].template[i];
				var tmpl=this._magazine.templates[tmpn];
				if (!onlykeeponrasterized||tmpl.keeponrasterized) {
					templatelist[tmpn]=tmpl;
					ret.push(tmpn);
				}
			}
		return ret;
	},
	getcombovalue:function(id) {
		return document.getElementById(id)[document.getElementById(id).selectedIndex].value;
	},
	isbrowseridle:function() {
		return !browse._loadingscreen&&!this._springing&&!this._animatinggui&&!this._travel&&!this._modalbox.animating&&(this._loadphase==1000)&&!browse._boxmaker.editing&&!browse._applypagequeue.busy;
	},	
	islandscape:function() {
		return (this._width>this._height);
	},	
	makepage:function(id) {
		var pg=document.createElement("div");
		pg.id=id;
		pg.style.position="absolute";
		pg.style.display="none";
		pg.style.left="0px";
		pg.style.top="0px";
		pg.style.overflow="hidden";
		pg.style.zIndex=1;
		return pg;
	},
	geturldata:function(ud,okcb,ctx) {
		if (ud.indexOf("nocache=yes")>=0) this._webcache[ud]=null;
		if (!this._webcache[ud]) {
			if (this._settings.debug>0) console.log("Loading DATA: "+ud);
			var xmlhttp=this.createXmlHttpRequest();
			xmlhttp.open("GET",ud,true);
			var self=this;
			xmlhttp.onreadystatechange = function() {
				 if(xmlhttp.readyState == 4)
				 	if(((xmlhttp.status == 200) || (xmlhttp.status == 0)) && xmlhttp.getAllResponseHeaders().length) {
				 		self._webcache[ud]=xmlhttp.responseText;
				 		if (ctx) okcb.apply(ctx,[self._webcache[ud]]);
				 		else okcb(self._webcache[ud]);
				 	}
			}
			xmlhttp.send(null);
		} else if (ctx) okcb.apply(ctx,[this._webcache[ud]]);
		else okcb(this._webcache[ud]);
	},	
	displaceobject:function(obj,x,y) {
		if (browse._hardware.transform==null) {
			obj.style.left=x+"px";
			obj.style.top=y+"px";
		} else obj.style[browse._hardware.transform.js]="translate("+x+"px,"+y+"px)";
	},	
	addEventListener:function(to,event,code) {
		if (to.addEventListener) to.addEventListener(event,code,false);
		else to.attachEvent('on'+event,code);
	},
	createXmlHttpRequest:function() {
		var xmlhttp=false;
	   /* running locally on IE5.5, IE6, IE7 */                                              ; /*@cc_on
		 if(location.protocol=="file:"){
		  if(!xmlhttp)try{ xmlhttp=new ActiveXObject("MSXML2.XMLHTTP"); }catch(e){xmlhttp=false;}
		  if(!xmlhttp)try{ xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){xmlhttp=false;}
		 }                                                                                ; @cc_off @*/
	   /* IE7, Firefox, Safari, Opera...  */
		 if(!xmlhttp)try{ xmlhttp=new XMLHttpRequest(); }catch(e){xmlhttp=false;}
	   /* IE6 */
		 if(typeof ActiveXObject != "undefined"){
		  if(!xmlhttp)try{ xmlhttp=new ActiveXObject("MSXML2.XMLHTTP"); }catch(e){xmlhttp=false;}
		  if(!xmlhttp)try{ xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }catch(e){xmlhttp=false;}
		 }
	   /* IceBrowser */
		 if(!xmlhttp)try{ xmlhttp=createRequest(); }catch(e){xmlhttp=false;}
		return xmlhttp;
	},
	htmlentities:function(t) {
		t+=""; // Ensures that "t" is a string
		var r=""; // Result
		var cc; // Temp charachter
		for(var i=0; i<t.length;i++) { // Fetch all entries
			cc=t.charAt(i).charCodeAt(0);
			if (cc==10) r+="<br>"; // Convert \n
			if (cc==32) r+="&nbsp;"; // Convert spaces
			else r+= '&#x'+cc.toString(16)+";"; // Encode char
		}
		return r; // Return result
	},
	geturlparameter:function(name) {
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec( window.location.href );
	  if( results == null )
		return "";
	  else
		return results[1];
	},
	fullscreenmessage:function(lbl) {
		var msg=document.createElement("div");
		document.body.style.WebkitUserSelect="auto";
		document.body.style.MozUserSelect="auto";
		msg.style.position="absolute";
		msg.style.zIndex=10000;
		msg.style.left=0;
		msg.style.top=0;
		msg.style.padding="10px";
		msg.style.backgroundColor="black";
		msg.style.color="white";
		msg.innerHTML=lbl;
		document.body.appendChild(msg);
		document.body.removeChild(this._display);
	},
	getsettingkey:function(issue,name) {
		return (issue?this._magazine.metadata.uid+"_":"")+name;
	},
	savesetting:function(issue,name,value) {
		var failed=false;
		if (this._hardware.uselocalstorage)
			try { localStorage[this.getsettingkey(issue,name)]=value; } catch (e) { failed=true; }
		if (!this._hardware.uselocalstorage||failed)
			document.cookie = this.getsettingkey(issue,name)+"="+(value?value:"; expires=-1")+"; path=/";
	},
	loadsetting:function(issue,name) {
		var loaded=null;
		var failed=false;
		if (this._hardware.uselocalstorage)
			try { loaded=localStorage[this.getsettingkey(issue,name)]; } catch (e) { failed=true; }
		if (!this._hardware.uselocalstorage||failed) {
			var keyname=this.getsettingkey(issue,name)+"=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==" ") c = c.substring(1,c.length);
				if (c.indexOf(keyname) == 0) return c.substring(keyname.length,c.length);
			}
			return null;
		} else return loaded;
	}
}

// ---
// Widget API
// ---
var widget={
	// Navigation
	gotosheet:function(sect,horz,vert) { browse.gotosheet(sect,horz,vert) },
	gotopage:function (sect,page) { browse.gotopage(sect,page) },
	// Modal
	togglemodal:function() { browse.togglemodal(true); },
	hidemodal:function() { if (browse._modalbox&&browse._modalbox.displayed) browse.togglemodal(true); },
	showmodal:function(value,effect) { browse.showmodal(value,effect); },
	// Scrollable pages
	pagesizechanged:function() {
		browse.adjustscrollablepages(); //Avoid to show the browser background if the page reduced its height
		browse.layoutpages(); // Update the scrollbar in any case
	},
	// passivepopup
	commonpassivepopup:function(state) {browse.passivepopup(browse._settings.passivepopups.common[state])},
	passivepopup:function(state) {browse.passivepopup(state)},
	// Status
	isonline:function() { return navigator.onLine; },
	// Context
	getcontext:function(obj) {
		return browse._widgetdata[obj.getAttribute('id')];
	},
	setcontext:function(obj,data) {
		browse._widgetdata[obj.getAttribute('id')]=data;
	},
	// Events
	broadcastevent:function(obj,name,data) {
		browse.broadcastevent(obj.containerpage,name,data);
	},
	// Scheduler
	schedule:function(from,time,obj,fn,args) {
		return browse.schedule(from.containerpage,time,obj,fn,args);
	},
	removeschedule:function(from,sched) {
		browse.removeschedule(from.containerpage,sched);
	},
	removeobjectschedules:function(from) {
		browse.removeobjectschedules(from.containerpage,from);
	},
	// Page lock
	getpagelock:function() { return browse.getpagelock()},
	setpagelock:function(lk) { return browse.setpagelock(lk)},	
	togglepagelock:function() { return browse.togglepagelock()},	
	// Widget
	makewidget:function(type,fath) { browse.makewidget(type,fath); },
	// Helpers 
	touchedobject:function(father,touch,attribute) {
		for (var i=0;i<father.childNodes.length;i++)  {
			var o2=father.childNodes[i];
			if (o2.getAttribute&&o2.getAttribute(attribute)&&(!((touch.clientY<(o2.offsetTop+father.offsetTop)) || (touch.clientY>o2.offsetTop+father.offsetTop+o2.offsetHeight-1) || (touch.clientX<o2.offsetLeft+father.offsetLeft) || (touch.clientX>o2.offsetLeft+father.offsetLeft+o2.offsetWidth-1))))
				return father.childNodes[i];
		}
		return null;
	},
	launchon:function(wdg,method,args) {
		return function(){
			var pargs=[];
			if (args) for (var a=0;a<args.length;a++) pargs.push(args[a]);
			if (arguments) for (var a=0;a<arguments.length;a++) pargs.push(arguments[a]);
			method.apply(wdg,pargs)
		};
	},
	getelementbyattribute:function(frm,id,value) {
		for (var i=0;i<frm.childNodes.length;i++)
			if (frm.childNodes[i].getAttribute&&frm.childNodes[i].getAttribute(id)==value) return frm.childNodes[i];
		return null;
	},
	makediv:function(data,to) {
		var ret=document.createElement("div");
		ret.style.position="absolute";		
		if (data.bgcolor!==undefined) ret.style.backgroundColor=data.bgcolor;
		if (data.x!==undefined) ret.style.left=data.x;
		if (data.y!==undefined) ret.style.top=data.y;
		if (data.z!==undefined) ret.style.zIndex=data.z;
		if (data.rx!==undefined) ret.style.right=data.rx;
		if (data.ry!==undefined) ret.style.bottom=data.ry;
		if (data.w!==undefined) ret.style.width=data.w;
		if (data.h!==undefined) ret.style.height=data.h;
		if (data.classname!==undefined) ret.className=data.classname;
		if (data.html!==undefined) ret.innerHTML=data.html;
		if (data.css) for (var a in data.css)  ret.style[a]=data.css[a];
		if (to) to.appendChild(ret);
		if (data.debug) {
			ret.style.border="1px dashed black";
			ret.style.backgroundColor="#cecece";
			ret.style.color="#000000";
		}		
		return ret;
	},
	applytouchevents:browse.applytouchevents,
	displaceobject:browse.displaceobject
}

// ---
// Document extension
// ---
document.getPageElementById=function(th,id) {
	return document.getElementById(th.getAttribute("widgetcontext")+"-"+id);
}

