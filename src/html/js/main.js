requirejs.config({
    "baseUrl": "js/",
    "paths": {
        // Modules
        templates: "templates",
        app: "webapp",
        // Vendor Libraries
        modernizr: "vendor/modernizr-2.6.2.min",
        handlebars: "vendor/handlebars-v1.3.0",
        jquery: ['//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min', 'vendor/jquery-2.1.0.min'],
        plugins: "plugins",
        tweenMax: "greensock-v12-js/src/minified/TweenMax.min",
        tweenMaxCssPlugin: "greensock-v12-js/src/minified/plugins/CSSPlugin.min",
        tweenMaxEasePlugin: "greensock-v12-js/src/minified/easing/EasePack.min",
        three: "three.min",
        CSS3DRenderer:"renderers/CSS3DRenderer",
        TrackballControls:"controls/TrackballControls"
    },
    shim:{
    	CSS3DRenderer: {
            "deps": ["three"]
        },
        tweenMaxCssPlugin: {
            "deps": ["tweenMax"]
        },
        tweenMaxEasePlugin: {
            "deps": ["tweenMax"]
        },
        TrackballControls: {
            "deps": ["three"]
        }
    }
});

require(['templates','modernizr','jquery','three','CSS3DRenderer','app','tweenMax','TrackballControls'], function(Templates) {
  	var addNodeTemplates = $('#inHgroup');
  	var areas = new Array();
  	areas["aboutbox"] = {open:false,content:'aboutboxcontent',active:false,loaded:false,baseUrl:"about"};
   	areas["worksbox"] = {open:false,content:'worksboxcontent',active:true,loaded:false,baseUrl:"work"};
   	areas["labsbox"] = {open:false,content:'labsboxcontent',active:false,loaded:false,baseUrl:"labs"};
   	var nApp = new WEBAPP(Templates,addNodeTemplates,areas);
   	//nApp.load('jpg');
   	
	/*
	var source   = $("#some-template").html();
	var template = Handlebars.compile("templates/about.html");
	var data = null;
	var dataReturn = template(data);
	console.log(dataReturn);
	$("#inHgroup").html(dataReturn);*/
});