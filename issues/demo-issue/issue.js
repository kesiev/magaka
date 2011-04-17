/*
 * These are you magazine's CSSs.
 * Plugins can include more CSS if needed.
 */
browse.addcss("issues/common/style.css");

/*
 * Your magazine's plugins.
 * Usually can be mapped to DOM elements for making them dynamic.
 */
browse.addplugin("flipper");
browse.addplugin("scrolly");
browse.addplugin("chrono");
browse.addplugin("rollindex");
browse.addplugin("bullet");
browse.addplugin("blackboard");
browse.addplugin("dragboard");
browse.addplugin("audioclip");
browse.addplugin("fullscreenimage");
browse.addplugin("youtubeclip");
browse.addplugin("drawer");
browse.addplugin("geobox");
browse.addplugin("infiniboard");
browse.addplugin("pagelocker");
browse.addplugin("over");

/*
 * Your magazine metadata.
 */
browse._magazine.metadata={

	// Unique ID of your magazine and its version. Used for locally storing data.
	uid:"SAMPLEMAGAZINE0",
	version:1,
	
	// Issue related settings
	title:"Sample Magazine",
	number:"0",
	
	// Apple related settings
	splashiphone:{
		portrait:"issues/demo-issue/splash-iphone-port.png",
		landscape:"issues/demo-issue/splash-iphone-land.png"
	},
	splashipad:{
		portrait:"issues/demo-issue/splash-ipad-port.png",
		landscape:"issues/demo-issue/splash-ipad-land.png"
	},
	icon:{
		iphone:"issues/demo-issue/appicon-iphone.png",
		ipad:"issues/demo-issue/appicon-ipad.png"
	},
	apptitle:"SampleMag",
	
	// Custom placeholders. Create your customized magazine-wide placeholders here.
	placeholders:{
		magazinecredits:
			"<b>Fonts</b><br>"+
			"<i>Diavlo</i> A font by Jos Buivenga (exljbris) -&gt; www.exljbris.com<br>"+
			"<br><b>Font tools</b><br>"+
			"<i>Font Squirrel</i> http://www.fontsquirrel.com/ for converting <i>Diavlo</i> font for being used on iPad<br>"+
			"<br><b>Colors palette</b><br>"+
			"<i>Quantic Stage</i> by rickomoreira http://kuler.adobe.com/#themeID/1093121<br>"+
			"<br><b>Gestures Stencils</b><br>"+
			"<i>Vector Gestural Icons</i> http://gesturecons.com/<br>"+
			"<br><b>Musics</b><br>"+
			"<i>Legend Of Sadness (intro)</i> by Robert Jaret &copy;2010<br>"+
			"<i>The Test Song</i> by Arnaldo Brenna &copy;2010<br>"+
			"<br><b>Tools &amp; Services</b><br>"+
			"<i>Manga Studio</i>, <i>The GIMP</i> and <i>Inkscape</i> for graphics<br>"+
			"<i>Textwrangler</i> as text editor<br>"+
			"The must-have <i>Toodledo.com</i> for managing tasks<br>"+
			"<br><b>2UP authors</b><br>"+
			"<i>Otilio Forlanelli</i> for the <i>L'editoria digitale e oltre.</i> article (http://www.otilio.eu/)<br>"+
			"<i>Bianca Brenna</i> for the <i>Literature on web</i> article (http://something-white.blogspot.com/)"+
			"<i>Simone Cicero</i> for the <i>Fitting technologies</i> article (http://meedabyte.wordpress.com/)"
	}
};
// ---
// Copyright (c) 2011 Francesco Cottone, http://www.kesiev.com/
// ---
/*
 * These are the condition to be used to check the magazine version to show.
 * Is a set of checks that are done to the device when the magazine is loaded or the active surface changes size.
 * When one of the condition is true, the tests are stopped and the related version ID is used.
 * Use:
 *
 * {islandscape:true,id:"<versionname>"} to set a version if the device is in landscape mode
 * {isportrait:true,id:"<versionname>"} to set a version if the device is in portrait mode
 * {sizelessthan:{width:<width>,height:<height>},id:"<versionname>"} to set a version checking the maximum display size
 * {sizemorethan:{width:<width>,height:<height>},id:"<versionname>"} to set a version checking the minimum display size
 * {sizeis:{width:<width>,height:<height>},id:"<versionname>"} to set a version checking the exact display size
 * {isipad:true,id:"<versionname>"} to set a version for iPad only
 * {isiphone:true,id:"<versionname>"} to set a version for iPhone only
 * {isipod:true,id:"<versionname>"} to set a version for iPod only
 * {isstandalone:true,id:"<versionname>"} to set a version if the app is in a bookmarklet
 * {isinbrowser:true,id:"<versionname>"} to set a version if the app is in loaded in the browser
 * {isonline:true,id:"<versionname>"} to set a version if the device is online
 * {isoffline:true,id:"<versionname>"} to set a version if the device is offline
 * {id:"<versionname>"} to set a version without condition (usually for fallback version)
 *
 * You can combine all the conditions together - will be evaluated in AND, so:
 *
 * {sizemorethan:{width:320,height:200},islandscape:true,id:"<versionname>"}
 *
 * Will apply the <versionname> version of the magazine if the screen resolution is greater than 320x200 AND the display is in landscape.
 *
 */
browse._magazine.version=[
	// default version for: size >= iPad, in Safari
	{islandscape:true,sizemorethan:{width:1023,height:659},id:"defaultversion"},
	{isportrait:true,sizemorethan:{width:767,height:915},id:"defaultversion"},
	 // mini version for: size >= iPhone, in fullscreen
	{islandscape:true,sizemorethan:{width:479,height:299},id:"mini"},
	{isportrait:true,sizemorethan:{width:319,height:459},id:"mini"},
	// bookmarklet instructions for: device is iphone or ipod
	{isiphone:true,id:"bookmarklet"},
	{isipod:true,id:"bookmarklet"},
	// Unavailable for others
	{id:"unavailable"} 
];

/*
 * Your pages templates. Can be stacked one over another one when creating the page.
 * Usually are HTML files.
 */
browse._magazine.templates={
	cover:{file:"issues/common/templates/cover.html"},
	
	defaultheader:{file:"issues/common/templates/default-header.html"},
	defaultmiddle:{file:"issues/common/templates/default-middle.html"},
	defaultfooter:{file:"issues/common/templates/default-footer.html"},
	defaultsolo:{file:"issues/common/templates/default-solo.html"},
	
	articletopfull:{file:"issues/common/templates/article-top-full.html"},
	articletopbottom:{file:"issues/common/templates/article-top-bottom.html"},
	articletopright:{file:"issues/common/templates/article-top-right.html"},
	articletopleft:{file:"issues/common/templates/article-top-left.html"},
	articletophub:{file:"issues/common/templates/article-top-hub.html"},

	articletoprightlong:{file:"issues/common/templates/article-top-right-long.html"},
	articlebottomfullfollow:{file:"issues/common/templates/article-bottom-full-follow.html"},
	
	articlebottomtextonly:{file:"issues/common/templates/article-bottom-textonly.html"},
	articlebottomleft:{file:"issues/common/templates/article-bottom-left.html"},
	articlebottomleft2:{file:"issues/common/templates/article-bottom-left2.html"},
	articlebottomhub:{file:"issues/common/templates/article-bottom-hub.html"},
	
	articlesololeft:{file:"issues/common/templates/article-solo-left.html"},
	articlesoloright:{file:"issues/common/templates/article-solo-right.html"},

	articlescrollmerge:{file:"issues/common/templates/article-scroll-merge.html"},
	articlescrollsimplemerge:{file:"issues/common/templates/article-scroll-simplemerge.html"},
	
	articletopsplit:{file:"issues/common/templates/article-top-split.html"},

	boxtopleft:{file:"issues/common/templates/box-top-left.html"},

	widgetthankyoubullet:{keeponrasterized:true,file:"issues/common/templates/widget-thankyou-bullet.html"},
	widgettop6scrolly:{keeponrasterized:true,file:"issues/common/templates/widget-top-6scrolly.html"},
	widgetleft6scrolly:{keeponrasterized:true,file:"issues/common/templates/widget-left-6scrolly.html"},
	widgetrightfiches:{keeponrasterized:true,file:"issues/common/templates/widget-right-fiches.html"},
	widgetrightface:{keeponrasterized:true,file:"issues/common/templates/widget-right-face.html"},
	widgetrightcomplex:{keeponrasterized:true,file:"issues/common/templates/widget-right-complex.html"},
	widgetrightyoutube:{keeponrasterized:true,file:"issues/common/templates/widget-right-youtube.html"},
	widgetboards:{keeponrasterized:true,file:"issues/common/templates/widget-top-boards.html"},
	widgettime:{keeponrasterized:true,file:"issues/common/templates/widget-right-time.html"},
	widgettopindex:{keeponrasterized:true,file:"issues/common/templates/widget-top-index.html"},
	widgetbottomgeo:{keeponrasterized:true,file:"issues/common/templates/widget-bottom-geo.html"},
	widgetrightlost:{keeponrasterized:true,file:"issues/common/templates/widget-right-lost.html"},
	widgetrightphotos:{keeponrasterized:true,file:"issues/common/templates/widget-right-photos.html"},

	widgetrightfichescss:{keeponrasterized:true,file:"issues/common/templates/widget-right-fiches-css.html"},
	
	/*
	 * MINI VERSIONS
	 */
	minicover:{file:"issues/common/templates/mini/cover.html"},
	minisolo:{file:"issues/common/templates/mini/default-solo.html"},
	miniarticlefulltop:{file:"issues/common/templates/mini/article-full-top.html"},
	miniwidgetthankyoubullet:{file:"issues/common/templates/mini/widget-thankyou-bullet.html"}

};

/*
 * Magazine content.
 * Is divided in "versions", that are decided using the browse._magazine.version queue.
 */
browse._magazine.versions={
			/*
			 * The "magazine unavailable" version. Contains just a page with a message explaining
			 * that the magazine wasn't designed for the device the user is using
			 */
			unavailable:{	
				metadata:{
					dontsavepositions:true				
					// If switched to true the "last seen page" cookie is not persisted when the user
					// see this "version" of the magazine. Is a nice trick if you want to have
					// a landscape only magazine and you want to show just a message to warn the
					// user that if is using the device in portrait mode. If he switch back to the
					// right side, the last valid page is shown again - making this "version" of the
					// magazine just like a "message box". Just remember to catch the supported
					// resolution on the "versions" section and add the "just a messagebox" version
					// as fallback entry.
					// You can switch this on also if you don't want to save the last seen page for
					// your magazine.
				},
				sections:[{id:"unavailable",title:"Magazine unavailable"}],
				articles:{
					unavailable:[
						{
							title:"Magazine unavailable",
							pages:['unavailable']
						}
					]
				}
			},

			/*
			 * The "bookmarklet me" version. Contains just a page with a message explaining
			 * how to add to the iPhone/iPad home screen the magazine.
			 */
			bookmarklet:{	
				metadata:{
					dontsavepositions:true				
				},
				sections:[{id:"bookmarklet",title:"Bookmarklet me!"}],
				articles:{
					bookmarklet:[
						{
							title:"Bookmarklet me!",
							pages:['bookmarklet']
						}
					]
				}
			},
			
			
			/*
			 * The main version of our magazine.
			 */
			defaultversion:{
				
				/*
				 * Magazine sections. They have an ID, a title and a subtitle.
				 */
				metadata:{
					// You can define a custom action to be done when double-clicking on the page.
					// If not defined, the default GUI bars are toggled (like calling
					// browse.togglegui(); )
					//ondoubletap:function(){alert("double clicked!")}
					
					// You can disable the automatic pan animation when you've to cross a lot of
					// pages. Just define the variable above to set the maximum numbers of pages
					// to be animated.
					pangapthreshold:3
				},
				sections:[
					{id:"rollingstart",title:"Rolling start",subtitle:"Something for getting started. An overview of #toolname#."},
					{id:"twoup",title:"2UP",subtitle:"Guest articles and extras just for #magazinetitle#, in english and italian."}
				],
				
				/*
				 * The gui details. It appears doubletapping on a page.
				 */
				gui:{
				
					/*
					 * Header related. The header is the upper bar.
					 */
					headerheight:74,
					
					/* You can use all the global placeholders available for the pages too.
					 * The most common are:
					 *
					 * #magazinenumber#: magazine number
					 * #sectionsubtitle#: current section subtitle
					 * #sectiontitle#: current section title
					 * #magazinetitle#: magazine title
					 * #articletitle#: current article title
					 * #articlesubtitle#: current article subtitle
					 * #vertical# #verticalcount#: vertical position
					 * #horizontal# #horizontalcount#: horizontal position
					 * #orientation#: current orientation
					 *
					 */
					
					headercontent:
						"<img src='#bundlepath#/images/logo.png'> <span class='magazinetitle'>#magazinetitle#</span> <span class='magazinenumber'>##magazinenumber#</span>"+
						"<div class='articlebox'><span class='sectiontitle'>#sectiontitle#</span><span class='magazinearticletitle'>#articletitle#</span><br><span class='magazinearticlesubtitle'>#articlesubtitle#</div></div>"+
						"<div class='buttonbox'><img src='#bundlepath#/images/index.png' onobjecttap=\"widget.showmodal('index')\"></div>"+
						"<div class='pagebox'>Article #vertical#/#verticalcount# Page #horizontal#/#horizontalcount# #orientation#</div>"
						,
						//"<div class='magazineinfo'></div>",
					
					/*
					 * Extra bar. Is the lower bar and, while have ever the same size, its content can change from article to article.
					 */
					extrabarheight:140,
					
					/*
					 * Misc bars and indicators settings
					 */
					barheight:4,
					opacity:0.3,
					margin:4,
					bulletspacing:5,
					bulletsize:8,
					barheight:4,
					filled:"libs/bullet-full.png",
					empty:"libs/bullet-empty.png"
				},
				
				/*
				 * The single articles of this version. Articles are layouted horizontally.
				 */
				articles:{
					// The section name
					rollingstart:[
						// Each item of this array is an article. Each article has a title, a subtitle and a set of pages.
						{
							title:"Cover",
							// A single page for this article
							pages:['cover'],
							// You can change page specifying the section name and the page...
							extra:"<div class='thumbbox'><span class='title' >Credits</span><br><img onobjecttap=\"widget.gotopage('rollingstart','credits')\" class='thumb' style='height:80px' src='#bundlepath#/thumbs/credits.png'><span class='description'>Check out the #magazinetitle# credits!</span></div>"+
							// ...or the section name and left and top coords on the magazine.
							// Coords can be numbers, "top" or "bottom" for the first and the last page and "left","right" for the left coords and "up","down" for the top coords.
							"<div class='thumbbox'><span class='title'>Spin the wheel!</span><br><img onobjecttap=\"widget.gotosheet('rollingstart',4,0)\" class='thumb' style='height:80px' src='#bundlepath#/thumbs/workflowlandscape.png'><span class='description'>Tokens to bet and wheels to spin! Check out the workflow casino!</span></div>"+
							"<div class='thumbbox'><span class='title'>Just draw it!</span><br><img onobjecttap=\"widget.gotopage('rollingstart','yourface')\" class='thumb' style='height:80px' src='#bundlepath#/thumbs/yourface.png'><span class='description'>#toolname# can help you creating your personal magazine, with your face on it! Just draw it!</span></div>"
						},
						{
							title:"Howto",
							// Titles and subtitles can have placeholders too.
							subtitle:"Learn how to browse #magazinetitle# with #toolname#.",
							pages:['howto']
						},
						{
							title:"Your face on it",
							subtitle:"At least your face can be on a cool magazine.",
							pages:['yourface']
						},
						{
							title:"Welcome, stranger!",
							subtitle:"Welcome to #magazinetitle# issue #magazinenumber#, the first magazine demo for #toolname#!",
							pages:['welcome','credits']
						},
						{
							title:"Workflow roulette",
							subtitle:"Bet on your favourite workflow and spin the wheel!",
							// Each page can have just a view for portrait or landscape or can be different.
							pages:[{portrait:'workflowportrait',landscape:'workflowlandscape'},'fiches']
						},
						{
							title:"High five",
							subtitle:"HTML5 makes everything spicy. Guess the taste!",
							pages:['highfive']
						},
						{
							title:"Multimedia Complex",
							subtitle:"Let's try to put together something old and new.",
							extra:"<div class='thumbbox'><span class='title' >Draw your face!</span><br><img onobjecttap=\"widget.gotopage('rollingstart','yourface')\" class='thumb' style='height:80px' src='#bundlepath#/thumbs/yourface.png'><span class='description'>The <i>blackboard</i> widget uses the <i>canvas</i> tag. Have a look!</span></div>",
							// Each page can have just a view for portrait or landscape or can be different.
							pages:[{portrait:'multimediacomplexscroll',landscape:'multimediacomplex'},{portrait:'multimediacomplexscroll',landscape:'youtubeclip'}]
						},
						{
							title:"Points of view",
							subtitle:"Getting creative mixing together technologies and fun. Changing points of view.",
							pages:['blackboards','brightboard','time']
						},
						{
							title:"You have been here.",
							subtitle:"In how many ways you can explain where you are?",
							pages:['hubpage','geohubpage']
						},
						{
							title:"Getting lost",
							subtitle:"Feeling alone? What to do next?",
							pages:['losingway']
						},
						{
							title:"Over.",
							subtitle:"Is this really over?",
							pages:['widgetover']
						},						
					],
					twoup:[
						{
							title:"L'editoria digitale e oltre.",
							subtitle:"L'editoria digitale che non esiste.",
							pages:[{portrait:'twoupotis',landscape:'twoupotisone'},{portrait:'twoupotis',landscape:'twoupotistwo'}]
						},
						{
							title:"Seriously. Who cares?",
							subtitle:"Mindless things about #toolname# and #magazinetitle# development.",
							pages:['twoupwhocares']
						},
						{
							title:"Literature on web",
							subtitle:"A new free field",
							pages:['twoupwhiteone']
						},
						{
							title:"The Cover. Unplugged.",
							subtitle:"Wondering how the original #magazinetitle# cover was during development? Voilat.",
							pages:['twouporgcover']
						},
						{
							title:"Fitting technologies",
							subtitle:"A good place for a <i>monotheistic's god</i> gift.",
							pages:['twoupsimoneone']
						}
					]
				}
			},
			mini:{
				/*
				 * The minified magazine (for smaller devices);
				 */
				metadata:{}, // Any particular metadata
				sections:[
					{id:"rollingstart",title:"Rolling start",subtitle:"Something for getting started. An overview of #toolname#."}
				],
				
				/*
				 * The gui details. It appears doubletapping on a page.
				 */
				gui:{
				
					/*
					 * Header related. The header is the upper bar.
					 */
					headerheight:64,
					
					/* You can use all the global placeholders available for the pages too.
					 * The most common are:
					 *
					 * #magazinenumber#: magazine number
					 * #sectionsubtitle#: current section subtitle
					 * #sectiontitle#: current section title
					 * #magazinetitle#: magazine title
					 * #articletitle#: current article title
					 * #articlesubtitle#: current article subtitle
					 * #vertical# #verticalcount#: vertical position
					 * #horizontal# #horizontalcount#: horizontal position
					 * #orientation#: current orientation
					 *
					 */
					
					headercontent:
						"<img src='#bundlepath#/images/logo.png'> <span class='magazinetitle'>#magazinetitle#</span> <span class='magazinenumber'>##magazinenumber#</span>"+
						"<div class='articlebox'><span class='sectiontitle'>#sectiontitle#</span><span class='magazinearticletitle'>#articletitle#</span></div>"
						,
						//"<div class='magazineinfo'></div>",
					
					/*
					 * Extra bar. Is the lower bar and, while have ever the same size, its content can change from article to article.
					 */
					extrabarheight:120,
					
					/*
					 * Misc bars and indicators settings
					 */
					barheight:4,
					opacity:0.3,
					margin:4,
					bulletspacing:5,
					bulletsize:8,
					barheight:4,
					filled:"libs/bullet-full.png",
					empty:"libs/bullet-empty.png"
				},
				
				/*
				 * The single articles of this version. Articles are layouted horizontally.
				 */
				articles:{
					// The section name
					rollingstart:[
						// Each item of this array is an article. Each article has a title, a subtitle and a set of pages.
						{
							title:"Cover",
							// A single page for this article
							pages:['minicover'],
							// You can change page specifying the section name and the page...
							extra:"<div class='minithumbbox'><span class='title' >Credits</span><br><img onobjecttap=\"widget.gotopage('rollingstart','miniwelcome')\" class='thumb' style='height:50px' src='#bundlepath#/thumbs/credits.png'><span class='description'>Check out the #magazinetitle# credits!</span></div>"
						},
						{
							title:"Howto",
							// Titles and subtitles can have placeholders too.
							subtitle:"Learn how to browse #magazinetitle# with #toolname#.",
							pages:['minihowto']
						},
						{
							title:"Welcome, stranger!",
							subtitle:"Welcome to #magazinetitle# issue #magazinenumber#, the first magazine demo for #toolname#!",
							pages:['miniwelcome']
						},
						{
							title:"The end... Already?",
							subtitle:"Try #magazinetitle# with a larger device!",
							pages:['miniend']
						}						
					]
				}
			}
		};

/*
 * The magazine data. Are the single pages that are used when creating the magazine versions.
 * Each page can have different structure and composition.
 */
browse._magazine.data={

	// The "magazine" unavailable page. Since is quite simple, its HTML is built-in
	unavailable:{
		html:"<p style='font-family:helvetica;text-align:center;'><img src='#bundlepath#/images/warn.png'><br><br>Sorry!<br><br>The resolution of your device is not suitable<br>for <b>#magazinetitle#</b> issue <b>#magazinenumber#</b>.</p>"
	},
	bookmarklet:{
		html:"<p style='font-family:helvetica;text-align:center;'><img src='#bundlepath#/images/warn.png'><br><br>Add me to your home screen!<br><br>Hit the + icon on the bottom bar<br>and add this page to<br>your Home Screen to start reading<br><b>#magazinetitle#</b> issue <b>#magazinenumber#</b>.</p>"
	},

	// The magazine pages.
	cover:{
		// You can specify a stack of page templates, defined into browse._magazine.templates.
		template:["cover"],
		// These placeholders are replaced from the page once the layers are stacked.
		placeholders:{
			header:"&laquo;Why don't try to make everything in HTML/JS/CSS?&raquo;",
			subheader:"KesieV, 1 november 2010",
			details:"The very first issue of <i>#magazinetitle#</i>!<br><br>In this issue, a little taste of a lot of things you can do with <b>#toolname#</b>!",
			credits:"<i>#magazinetitle#</i> is the example magazine for <i>#toolname#</i>. &copy;2011 KesieV - All rights reserved - <i>#toolname#</i> is #toollicense# licensed."
		}
	},
	// This is a single page, without layers and placeholders
	howto:{file:"issues/demo-issue/custompages/howto.html"},	
	welcome:{
		// Multiple layers...
		template:["defaultheader","articletopfull"],
		// ...and external placeholders
		placeholders:"issues/demo-issue/articles/welcome.txt",
	},
	credits:{
		template:["defaultfooter","articlebottomtextonly","widgetthankyoubullet"],
		placeholders:{article:"#magazinecredits#"}
	},
	yourface:{
		template:["defaultsolo","articlesololeft","widgetrightface"],
		placeholders:"issues/demo-issue/articles/yourface.txt",
	},
	highfive:{
		template:["defaultsolo","articlesoloright","widgetrightphotos"],
		placeholders:"issues/demo-issue/articles/highfive.txt"
	},
	workflowlandscape:{
		template:["defaultheader","articletopbottom","widgettop6scrolly"],
		placeholders:"issues/demo-issue/articles/workflow.txt",
	},
	workflowportrait:{
		template:["defaultheader","articletopright","widgetleft6scrolly"],
		placeholders:"issues/demo-issue/articles/workflow.txt",
	},
	fiches:{
		template:["defaultfooter","articlebottomleft","widgetrightfiches"],
		placeholders:"issues/demo-issue/articles/fiches.txt",
	},
	multimediacomplex:{
		template:["defaultheader","articletopleft","widgetrightcomplex"],
		placeholders:"issues/demo-issue/articles/multimediacomplex.txt",
	},
	youtubeclip:{
		template:["defaultfooter","articlebottomleft2","widgetrightyoutube"],
		placeholders:"issues/demo-issue/articles/multimediacomplex.txt",
	},
	multimediacomplexscroll:{
		template:["articlescrollmerge"],
		placeholders:"issues/demo-issue/articles/multimediacomplex.txt",
		scrollpage:true
	},
	blackboards:{
		template:["defaultheader","articletopsplit","widgetboards"],
		placeholders:"issues/demo-issue/articles/splitted.txt"				
	},
	brightboard:{
		template:["defaultmiddle"],
		html:"<div class='defaultfont brightbox' style='position:absolute;top:0px;left:31px;right:31px;bottom:0px;'><div style='float:left;width:50%;margin:30px 0px 0px 30px'><span class='title'>#pagetitle#</span></div><div  class='textbox' style='background-color:#000000;color:#ffffff;padding:20px;float:left;top:30px;width:50%;margin:30px 30px 0px 30px'>#article#</div></div>",
		placeholders:{
			pagetitle:"Probably the truth is in colors.",
			article:"<p>This is a mix of the techniques explained since now: this page is composed by the standard marked borders of the magazine on the sides, loaded from a template file as usual but the page layout is built-in into the issue file which has placeholders referenced into the issue files itself.</p><p>As you've understand, it is just a matter of mixing and getting creative. The <i>classname trick</i> explained before changes the page background and the text color. Try to change <i>your point of view</i> on this page too.</p><p>Plus! This box glows in the dark! Try to switch off the light in <i>portrait</i>!</p>"
		}
	},
	time:{
		template:["defaultfooter","articlebottomleft","widgettime"],
		placeholders:"issues/demo-issue/articles/chrono.txt"
	},
	hubpage:{
		template:["defaultheader","articletophub","widgettopindex"],
		placeholders:"issues/demo-issue/articles/hub.txt"				
	},
	geohubpage:{
		template:["defaultfooter","articlebottomhub","widgetbottomgeo"],
		placeholders:"issues/demo-issue/articles/geohub.txt"				
	},
	losingway:{
		template:["defaultsolo","articlesololeft","widgetrightlost"],
		placeholders:"issues/demo-issue/articles/losingway.txt"		
	},
	widgetover:{
		dontrasterize:true, // Since is fully animated, this page will never be rasterized if needed.
		file:"issues/demo-issue/custompages/over.html"
	},
	
	twoupotisone:{
		template:["defaultheader","articletoprightlong"],	
		placeholders:"issues/demo-issue/articles/twoup-otis.txt"		
	},
	twoupotistwo:{
		template:["defaultfooter","articlebottomfullfollow"],	
		placeholders:"issues/demo-issue/articles/twoup-otis.txt"		
	},
	twoupwhiteone:{
		template:["defaultsolo","articletopright","boxtopleft"],	
		placeholders:"issues/demo-issue/articles/twoup-white.txt"		
	},
	twoupsimoneone:{
		template:["defaultsolo","articletopright","boxtopleft"],	
		placeholders:"issues/demo-issue/articles/twoup-simone.txt"		
	},	
	twoupotis:{
		template:["articlescrollsimplemerge"],
		placeholders:"issues/demo-issue/articles/twoup-otis.txt",
		scrollpage:true
	},
	twoupwhocares:{
		template:["defaultsolo","articlesololeft","widgetrightfichescss"],
		placeholders:"issues/demo-issue/articles/twoup-whocares.txt",
	},
	twouporgcover:{
		file:"issues/demo-issue/custompages/org-cover.html"
	},
	
	
	/*
	 * MINI PAGES
	 */
	minicover:{
		// You can specify a stack of page templates, defined into browse._magazine.templates.
		template:["minicover"],
		// These placeholders are replaced from the page once the layers are stacked.
		placeholders:{
			header:"&laquo;Why don't try to make everything in HTML/JS/CSS?&raquo;",
			subheader:"KesieV, 1 november 2010",
			details:"The very first issue of <i>#magazinetitle#</i>!<br><br>In this issue, a little taste of a lot of things you can do with <b>#toolname#</b>!",
			credits:"<i>#magazinetitle#</i> is the example magazine for <i>#toolname#</i>. &copy;2011 KesieV - All rights reserved - <i>#toolname#</i> is #toollicense# licensed."
		}
	},
	minihowto:{file:"issues/demo-issue/custompages/mini/howto.html"},	
	miniwelcome:{
		template:["miniarticlefulltop","miniwidgetthankyoubullet"],
		placeholders:"issues/demo-issue/articles/welcome.txt",
		scrollpage:true
	},
	miniend:{file:"issues/demo-issue/custompages/mini/end.html"},	
	 
	
	/* 
	 * MODAL PAGES
	 * Are not used directly into the magazine but opened in modals. Modal views are just
	 * pages like the others!
	 * Since must be kept on the rasterized version too, we set the keeponrasterized:true property
	 * in order to copy them as is.
	 */
	// This is the "index" page. Modals like the index are just pages like the others.
	index:{keeponrasterized:true,widget:"rollindex",attrs:"sidemargin=250 thumbnailwidth=180 thumbnailmargin=10  thumbnailshadow=yes class='rollindex-default'"},	 
	infiniboard:{keeponrasterized:true,widget:"infiniboard",widgetcontent:"{w:749,h:305,img:'issues/demo-issue/images/infiniboard.png',squares:["+
		"{x:0,y:0,w:190,h:305,action:function(){widget.gotopage(null,'cover')}},"+
		"{x:190,y:0,w:130,h:150,action:function(){widget.gotopage(null,'howto')}},"+
		"{x:320,y:0,w:132,h:150,action:function(){widget.gotosheet(null,4,0)}},"+
		"{x:190,y:150,w:262,h:155,action:function(){widget.gotopage(null,'yourface')}},"+
		"{x:452,y:0,w:214,h:86,action:function(){widget.gotopage(null,'multimediacomplex')}},"+
		"{x:452,y:86,w:147,h:219,action:function(){widget.gotopage(null,'welcome')}},"+
		"{x:599,y:86,w:150,h:219,action:function(){widget.gotopage(null,'blackboards')}},"+
		"{x:666,y:0,w:84,h:86,action:function(){widget.gotopage(null,'widgetover')}}"+
		"]}"},
	fullscreenblackboard:{keeponrasterized:true,widget:"blackboard",style:"background-image:url('#bundlepath#/images/facebg.jpg')",attrs:"canvascolor='clear'"},
	fullscreenblackboardinverted:{keeponrasterized:true,widget:"blackboard",attrs:"canvascolor='black' pencolor='white' pensize=8"}

};
