define(['vendor/createjs/events/Event',
        'vendor/createjs/events/EventDispatcher',
        'vendor/createjs/utils/IndexOf',
        'vendor/createjs/utils/Proxy',
        'vendor/preloadjs/AbstractLoader',
        'vendor/preloadjs/LoadQueue',
        'vendor/preloadjs/TagLoader',
        'vendor/preloadjs/XHRLoader'], function(a,b,c,d,e,f,g,h)
{
	var workclass = function(params){
		var instance = this;
		var images = [];
		var map = {};
		var factory = [];
		var preload;

		var mevent = new CustomEvent("App.change",{detail:null});
		params.dispatchEvent(mevent);
		

		function loopLoadingContents(Things){
			preload = new createjs.LoadQueue(true);
			preload.on("fileload", handleFileLoad);
            preload.on("progress", handleOverallProgress);
            preload.on("fileprogress", handleFileProgress);
            preload.on("error", handleFileError);
            preload.setMaxConnections(5);

			for (var i = 0; i < Things.length; i++) {
				//Things[i].getAttribute("src-file");
				var infoElement = addPreloader(Things[i]);
				var strImg = Things[i].getAttribute('src-file');
				map[i] = infoElement;
				factory.push({src:strImg,id:i});
			};
			loadFileTray();
		}

		function loadfile(item,id){
			preload.loadFile({src:item,id:id});

		}
		function loadFileTray(){
			if(factory.length>0){
				var strImg = factory[0].src;
				loadfile(strImg,factory[0].id);
				factory.shift();
				return "loaded";
			} else {
				return "end";
			}
		}
		function handleFileLoad(event) {
			var removePreload = map[event.item.id].preload;
			var item = map[event.item.id].container;
			var img = event.result;
			item.appendChild(img);
			TweenLite.to(removePreload, 2, {opacity:0});
			//console.log('event.Load')
			loadFileTray();
			params.dispatchEvent(mevent);
			//console.log('===',item.parentNode.parentNode);
		}
		// File progress handler
        function handleFileProgress(event) {
        	var item = map[event.item.id].progressItem;
        	item.style.height = Math.round(event.progress*58)+"px";
        }
        // An error happened on a file
        function handleFileError(event) {
        	//event.item.id
        }
        // Overall progress handler
        function handleOverallProgress(event) {
        	//preload.progress
        }

		function addPreloader(element){
			var img = element;
			img.style.display = 'none';
			var divPreload = document.createElement("div");
			var imgPreload = document.createElement("div");
			var divloadProgress = document.createElement("div");
			var contentWrapper = document.createElement("div");

			//imgPreload.src = "img/smallogo.png";
			divPreload.className = "preloader preloaderSize";
			imgPreload.className = "imagePreload";
			divloadProgress.className = "overprogress";

			divPreload.appendChild(imgPreload);
			divPreload.appendChild(divloadProgress);
			img.parentNode.appendChild(divPreload);
			var parent = img.parentNode;
			img.parentNode.removeChild(img);

			return {preload:divPreload,container:parent,progressItem:divloadProgress};
		}

		function getAllImages(){
			var returnInfo = $("ul.centercontent > li > .project-imgcontainer > img");
			return returnInfo;
		}

		function init(){
			images = getAllImages();
			loopLoadingContents(images);
		}
		init();
	}

	workclass.prototype.loadimages = function(params){

	}

	return workclass;
});


