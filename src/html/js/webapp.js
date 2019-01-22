var WEBAPP = function(params,node,areasContent) {
	var instance = this;
	Object.defineProperties(this, {
		__proto__: null,
		menuActive:{
			value:false,
			writable:true,
			enumerable: false
		},
     	defaultType: {
          value: "web",
          writable: false
      	},
      	load: {
          value: function(type) {
              console.log("LOADED##",type);
          },
          enumerable: false
      	}
  	});
  	Object.defineProperty(this, "name", { value :"pixelweb",writable : false });
  	Object.defineProperty(this, "active3d", { value :true,writable : true });
  	Object.defineProperty(this, "contentContain", { 
  		value :new THREE.Object3D(),
  		writable : true,
  		enumerable: false
  	});
  	Object.defineProperty(this, "areas", { value :areasContent,writable : true });
  	Object.defineProperty(this, "arrayContentObjects", { value :[],writable : true });
  	Object.defineProperty(this, "templates", { value :params,writable : true });
  	// PRIVATE VARS
  	this.viewHeight = window.innerHeight;
  	var inHgroup;
    var conn = "ACE VALUE";
    var container;
	var controls;
	var root;
	var camera, scene, renderer;
	var geometry, material, mesh;
	var scene2, renderer2,cameraCube;
	var arrayObjects = new Array();
	var trackball = true;
    // PRIVATE METHODS
    //////////////////////////////////////////////////
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	function addEvents(){
		for (var iprop in instance.areas) {
			var elementBt = document.getElementById(iprop);
			if(instance.areas[iprop].active){
				if(!instance.areas[iprop].loaded){
					console.log("CAN LOAD CONTENT");
				}
				console.log('bt event added');
				elementBt.addEventListener('click',instance.dispathcToggleItem);
				elementBt.instance = instance;	
			}
		};
	}
	this.requestAddEvents = addEvents;
	function initAreas(){
		var elesm = document.getElementsByClassName('areaContainer');// $('.areaContainer');
		var nValue = node[0];
		console.log(nValue.offsetWidth)
		camera = new THREE.PerspectiveCamera( 16, nValue.offsetWidth/ instance.viewHeight-20, 400, 2550);
		instance.active3d = true;
		scene2 = new THREE.Scene();		
		root = new THREE.Object3D();
		scene2.add( root );		
		var rotations = new Array(0,90,180,270)

		if(trackball){
			controls = new THREE.TrackballControls( camera );
			controls.rotateSpeed = 1.0;
			controls.zoomSpeed = 1.2;
			controls.panSpeed = 0.8;

			controls.noZoom = false;
			controls.noPan = false;

			controls.staticMoving = false;
			controls.dynamicDampingFactor = 0.3;
			controls.keys = [ 65, 83, 68 ];
		}
		for ( var i = 0; i < elesm.length; i ++ ) {
			element = elesm[i];//elementss[0];
			console.log(element)
			var object = new THREE.CSS3DObject( element );
			var areax = new THREE.Object3D();
			var tempString = "#"+element.id+"content";
			var elContent = $(tempString)[0];
			var contentContain = new THREE.Object3D();
			var object_content = new THREE.CSS3DObject( elContent );
			contentContain.add( object_content );
			areax.add( contentContain );
			areax.add( object );
			root.add( areax );

			element.addEventListener('App.activeClick',function(ev){
				instance.rotateCube({rotation:{x:instance.calcRadians(90),delay:2}},areax);
			});
			instance.arrayContentObjects.push({container:areax,infoRef:element,content:object_content});
			//areax.position.y = -(i * (height+10));
		}	
		camera.position.set( 0, 0, 2550);		
		//camera.target.set(0,300,0)
		//TweenLite.to(areax.rotation, 12, {x:1.57079633});
		//root.rotation.y = 10		
		var itemz = node[0]
		renderer2 = new THREE.CSS3DRenderer();
		renderer2.setSize(nValue.offsetWidth+6, instance.viewHeight);
		renderer2.domElement.style.position = 'absolute';
		renderer2.domElement.style.overflow = 'inherit';
		
		//renderer2.domElement.style.top = 0;
		node.append( renderer2.domElement );
		renderer2.render( scene2 , camera);
		manageObjectsInit();
	}
	this.initAreasRequest = initAreas;
	function manageObjectsInit(){
		var incPos = 0;
		for(var i=0;i<instance.arrayContentObjects.length;i++){
			var myObject3D = instance.arrayContentObjects[i].container;
			var infoRef = instance.arrayContentObjects[i].infoRef;
			var content = instance.arrayContentObjects[i].content;
			var res = myObject3D.children[0];
			//content.position.y = 0//-Math.round(res.children[0].element.clientHeight/2)-(56);
			var rads = instance.calcRadians(-90);
			//content.parent.rotation.x = rads;
			content.parent.position.y += Math.round(infoRef.offsetHeight/2);
			content.parent.position.z += Math.round(-content.element.offsetHeight/2);//(content.element.offsetHeight/2);infoRef.offsetHeight/2
			myObject3D.position.x = 0;
			content.parent.rotation.x = rads;
			var listnerPlace = content.parent.children[0].element;
			listnerPlace.addEventListener('App.change',function(){
				content.parent.position.z = Math.round(-content.element.offsetHeight/2);
				TweenLite.to(myObject3D.position, 1, {y:content.parent.position.z,delay:0});
			});
		}
		var hgroupElement = node[0];
		hgroupElement.style.height = (-incPos)+'px';
	}
	function animate() {

		if(instance.active3d){
			requestAnimationFrame(animate);	
			renderer2.setSize(node[0].offsetWidth+6,instance.viewHeight-20);
			renderer2.render( scene2, camera );
			if(trackball){
				controls.update();
			}
			//console.log(node[0].offsetWidth<400)
		}
		
		//
	}
	this.requestAnimation = animate;
	window.addEventListener('resize', function(event){
  		// do stuff here
  		instance.viewHeight = window.innerHeight;
  		
  		if (Modernizr.mq('only all and (max-width: 480px)')) {
			console.log("IS UNDER WIDTH 480PX");
			instance.active3d = false;
			instance.changeTo2DView();
  		}
	});
	function addContentsToStage() {
		inHgroup = document.getElementById("inHgroup");
		//inHgroup.innerHTML += instance.templates.about(); 
		inHgroup.innerHTML += instance.templates.work(); 
		//inHgroup.innerHTML += instance.templates.labs(); 
	}
	function addContentsToArea(contentName) {
		var nodeInsert = document.getElementById("worksboxcontent");
		if (contentName=="work") {
			//var groupWrapper = document.getElementsByClassName("work-wrapper");
			var areaConteudo = document.getElementById("containworks");
			var returnContent = instance.templates.ContentWork();
			areaConteudo.innerHTML = returnContent.html;
			returnContent.init(areaConteudo.parentNode);
		};
		
	}
	this.addContentsToArea = addContentsToArea;
	//////////////////////////////////////////
	/////////////////////////////////////////
	function init(){
		addContentsToStage();
		//if condition 2d or 3d
		initAreas();
		addEvents();
		animate();
		var changView = document.getElementById("changeView");
		if(changView!=null){
			changView.addEventListener('click',function(ev){instance.toggle3DView(ev)});
		}
    }
    function sendCamera(){
    	//camera.position
    	console.log("SEND")
    	var position = camera.position;
    	TweenLite.to(position, 1, {z:position.z-100,x:-250+Math.random()*500,y:-250+Math.random()*500});
    }
    this.sendCamera = sendCamera;
    this.addContentsToStage = addContentsToStage;
    init();
};

//////////////// PUBLIC HID METHODS ///////////////////
WEBAPP.prototype.toggle3DView = function(ev){
	 //this.sendCamera();
	if(this.active3d){
		this.active3d = false;
		this.changeTo2DView();
	} else {
		this.active3d = true;
		this.changeTo3DView();
		this.requestAnimation();
		
	}
}

WEBAPP.prototype.changeTo3DView = function(ev,param){
	var Things = this.arrayContentObjects;
	for (var i = 0; i < Things.length; i++) {
		var nodeElement = Things[i].infoRef;
		var content3D = Things[i].content;
		var nodeElementContent = content3D.element;
		nodeElement.style = Things[i].saveStyle.nodeElement;
		nodeElement.parentNode.style = Things[i].saveStyle.nodeElementParent;
		nodeElementContent.style = Things[i].saveStyle.nodeElementContent;
		nodeElementContent.parentNode.style = Things[i].saveStyle.nodeElementContentParent;
	};
}
WEBAPP.prototype.changeTo2DView = function(ev,param){
	var Things = this.arrayContentObjects;
	for (var i = 0; i < Things.length; i++) {
		var nodeElement = Things[i].infoRef;
		var content3D = Things[i].content;
		var nodeElementContent = content3D.element;
		Things[i].saveStyle = {};
		Things[i].saveStyle.nodeElement = nodeElement.style;
		Things[i].saveStyle.nodeElementParent = nodeElement.parentNode.style;
		Things[i].saveStyle.nodeElementContent = nodeElementContent.style;
		Things[i].saveStyle.nodeElementContentParent = nodeElementContent.parentNode.style;
		nodeElement.removeAttribute("style");
		nodeElementContent.removeAttribute("style");
		nodeElement.parentNode.removeAttribute("style");
		nodeElementContent.parentNode.removeAttribute("style");
	};

}
WEBAPP.prototype.calcRadians = function(value){
	var degrees = value;
	var radians = (degrees*Math.PI)/180;	
	return radians;
}

WEBAPP.prototype.toggleOpenMenu = function(ev,param){
	var myelemnt = $('.logoimg');
	var target = ev.target;
	console.log(this.menuActive)

	
	if(param!=null){
		this.menuActive = param;
	}
	
	if(this.menuActive){
		//$('#menuopen').visibility="hidden";
		$('#menuopen').animate({opacity:1,width:'45px'}, 350);
		$('.verticalmenu').animate({opacity:0}, 350);
		this.menuActive = false;
		rotateCube({rotation:{y:-0},position:{z:0,x:0}},arrayObjects[0]);
		
	} else {
		//$('#menuopen').visibility="hidden";
		$('#menuopen').animate({opacity:0,width:'0px'}, 350);
		$('.verticalmenu').animate({opacity:1}, 350);
		rotateCube({rotation:{y:-.20},position:{z:-20,x:0}},arrayObjects[0]);
		menuOpen = true;
	}
	if((target.className=="works") || (target.className=="labs") || (target.className=="about")){
		var refrename = "#"+target.className+"box";
		var refelemnt = $(refrename)[0];
		dispathcOpenCloseItem(refelemnt,true)
	}
}
WEBAPP.prototype.toggleItem = function(ev){
	var elemtClick = ev.target;
	var stringRefere = elemtClick.parentNode.parentNode;
	dispathcOpenCloseItem(stringRefere)
}
WEBAPP.prototype.rotateCube = function(value,elements){
	var myelemnt = elements//arrayObjects[0];	
	for(var prop in value){
		var strinValue = value[prop];
		var elementChange = myelemnt[prop];
		var valorIr = new Object();
		console.log(strinValue)
		for(var inprop in strinValue){
			var valor = strinValue[inprop];
			valorIr[inprop] = valor;			
			valorIr.ease = Cubic.easeOut;
		}
		TweenLite.to(elementChange, .8, valorIr);
	}
}

WEBAPP.prototype.dispathcToggleItem = function(ev,param){
	var instance = this.instance;
	var stringRefere = this.id;
	
	if(instance.areas[stringRefere].open){
		instance.areas[stringRefere].open = false;
	} else {
		instance.areas[stringRefere].open = true;
		if(!instance.areas[stringRefere].loaded){
			instance.addContentsToArea(instance.areas[stringRefere].baseUrl);
			var elment = ev.target.parentNode.parentNode;
			var mevent = new CustomEvent("App.activeClick",{detail:null});
			elment.dispatchEvent(mevent);
		}
	}
}