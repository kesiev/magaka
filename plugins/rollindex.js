// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
browse._widgets.rollindex={
	global:{
		onpageprepare:function(){
			var sidemargin=this.getAttribute("sidemargin");
			this._sideclass=this.getAttribute("sideclass");
			this._thumbnailshadow=browse._hardware.boxshadow&&(this.getAttribute("thumbnailshadow")=="yes");
			this._thumbnailwidth=this.getAttribute("thumbnailwidth")*1;
			this._thumbnailmargin=this.getAttribute("thumbnailmargin")*1;
			this._columnwidth=this._thumbnailwidth+(this._thumbnailmargin*2);
			this._articletapped=-1;
			this._springing=false;
			widget.makediv({x:sidemargin+"px",y:"0px",rx:"0px",ry:"0px",z:-1,classname:"background"},this);
			this._sections=widget.makediv({x:sidemargin+"px",y:"0px",rx:"0px",classname:"sectionbar"},this);
			var sidebar=widget.makediv({x:"0px",y:"0px",w:sidemargin+"px",ry:"0px",classname:"sidebar"},this);
			this._scrolly=widget.makediv({x:sidemargin+"px",y:sidemargin+"px",rx:"0px",ry:"0px",classname:"scrolly",css:{overflow:"hidden"}},this);
			this._scrollybox=widget.makediv({x:"0px",y:"0px",classname:"scrollybox"},this._scrolly);
			this._sidebardetail=widget.makediv({x:"30px",rx:"30px",y:sidemargin+"px",classname:"sidebartext"},sidebar);
			this._sidebarsectiondetail=widget.makediv({x:"30px",y:"30px",rx:"30px",classname:"sidebarsectiondetail"},sidebar);
			widget.makediv({x:(sidemargin-20)+"px",y:(sidemargin-30)+"px",classname:"arrowup"},this);
			widget.applytouchevents(this._scrolly,
				widget.launchon(this,this.scrollytouchstart),
				widget.launchon(this,this.scrollytouchmove),
				widget.launchon(this,this.scrollytouchend)
			);
		},
		onpageshow:function() {
			this._currentsection=browse._current.section;
			this._sections.innerHTML="";
			for (var a=0;a<browse._current.sections.length;a++)
				this._sections.innerHTML+="<div sid='"+a+"'>"+browse._current.sections[a].title+"</div>";
			for (var a=0;a< this._sections.childNodes.length;a++)
				widget.applytouchevents(this._sections.childNodes[a],null,null,widget.launchon(this,this.sectionclick,[browse._current.sections[a]]));
			this.onsectionchange();
		},		
		onsectionchange:function() {
			var cursel=browse._magazine.versions[browse._current.magazineversionid]
			this._articles=cursel.articles[this._currentsection.id];
			this._sidebarsectiondetail.innerHTML="<div class='sectiontitle'>"+browse.applystandardplaceholders(this._currentsection.title)+"</div>";
			if (this._currentsection.subtitle) this._sidebarsectiondetail.innerHTML+="<div class='sectionsubtitle'>"+browse.applystandardplaceholders(this._currentsection.subtitle)+"</div>";
			for (var a=0;a< this._sections.childNodes.length;a++)
				this._sections.childNodes[a].className=(browse._current.sections[a]==this._currentsection?"section-selected":"")+" section";
			var html="";
			var pg="";
			this._left=0;
			for (var a=0;a<this._articles.length;a++) {
				html+="<div style='position:absolute;top:0px;left:"+(a*(this._thumbnailwidth+(this._thumbnailmargin*2)))+"px;"+(this._thumbnailshadow?browse._hardware.boxshadow.style+": 0px 0px 4px #000;":"")+"margin:0px "+this._thumbnailmargin+"px 0px "+this._thumbnailmargin+"px' class='column'>";
				for (var b=0;b<this._articles[a].pages.length;b++) {
					pg=browse.decidecontent(this._articles[a].pages[b],{landscape:true});
					html+="<img class='thumb' style='width:"+this._thumbnailwidth+"px' src='"+browse._magazine.bundle+"/thumbs/"+browse.solvepagealias(pg)+".png'>";
				}
				html+="</div>";
			}
			widget.displaceobject(this._scrollybox,this._left,0);
			this._scrollybox.innerHTML=html;
			this._scrollybox.style.width=this._columnwidth*this._articles.length;
			if (this._currentsection==browse._current.section)
				this._chunk={left:-this._columnwidth*browse._current.horizontal,article:browse._current.horizontal,node:this._scrollybox.childNodes[browse._current.horizontal]};
			else this._chunk={left:0,article:0,node:this._scrollybox.childNodes[0]};
			this._left=this._chunk.left;
			// Link articles column to the tap action
			for (var a=0;a<this._scrollybox.childNodes.length;a++)
				widget.applytouchevents(this._scrollybox.childNodes[a],
					widget.launchon(this,this.articletapped,[a]),
					null,
					null
				);
				
			widget.displaceobject(this._scrollybox,this._left,0);			
			this.updatesidebar();
		},
		onarticlechange:function() {
			widget.gotosheet(this._currentsection.id,this._articletapped,0);
			widget.hidemodal();
		},

		
		// UTILS
		guibusy:function() {
			return (this._springing);
		},
		
		// SPRING
		startspringing:function(th) {
			if (!this._springing) {
				this._springing=true;
				this.spring();
			}
		},
		spring:function() {
			var gap=(this._chunk.left-this._left)/2;
			if (Math.abs(gap)<=1) {
				this._left=this._chunk.left;
				this._springing=false;
			} else this._left+=gap;
			widget.displaceobject(this._scrollybox,this._left,0);
			if (this._springing) setTimeout(widget.launchon(this,this.spring),browse._settings.spring.time);
		},
		
		updatesidebar:function() {
			this._sidebardetail.innerHTML="<div class='articletitle'>"+browse.applystandardplaceholders(this._articles[this._chunk.article].title)+"</div>";
			if (this._articles[this._chunk.article].subtitle)
				this._sidebardetail.innerHTML+="<div class='articlesubtitle'>"+browse.applystandardplaceholders(this._articles[this._chunk.article].subtitle)+"</div>";
		},
		

		
		// Drag
		scrollytouchstart:function(e) {
			e.preventDefault();		
			if (e.touches.length != 1) return false;
			if (!this._dragstart&&!this.guibusy()) {
				this._newleft=this._left;
				this._centerx=e.touches[0].clientX;
				this._centery=e.touches[0].clientY;
				this._dragstart=true;
			}
		},
		scrollytouchmove:function(e) {
			e.preventDefault();
			if (e.touches.length != 1) return false;
			if (this._dragstart) {
				this._newleft=this._left-(this._centerx-e.touches[0].clientX);
				var oldart=this._chunk.article;
				for (var i=0;i<this._scrollybox.childNodes.length;i++) {
					this._chunk={left:-(i*this._columnwidth),article:i,node:this._scrollybox.childNodes[i]};
					if (((i+1)*this._columnwidth)>-this._newleft) break;
				}
				if (this._chunk.article!=oldart) this.updatesidebar();
				widget.displaceobject(this._scrollybox,this._newleft,0);
			}
		},
		scrollytouchend:function(e,th) {
			e.preventDefault();
			if (e.touches.length > 0) return false;
			if (this._dragstart) {
				if ((Math.abs(this._left-this._newleft)<browse._settings.spring.dragthreshold)&&(this._articletapped!=-1))
					this.onarticlechange();
				this._articletapped=-1;
				this._left=this._newleft;
				this._dragstart=false;
				this.startspringing();
			}
		},
		
		// Touch
		sectionclick:function(sel,e) {
			e.preventDefault();
			if (!this.guibusy()) {
				this._currentsection=sel;
				this.onsectionchange();
			}
		},
		
		articletapped:function(art,e) {
			this._articletapped=art;
		},
		
	}	
	
	
}