/* 
Author: Pedro Martins
email: pedro.martins@pixelkiller.net
Date: 07/2015
*/
define(['character'], function() {
    var mjFrameAnim = '{"default":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":593,"w":28,"h":55} }, {"filename": "backimage", "frame": {"x":156,"y":592,"w":27,"h":56} }, {"filename": "backimage", "frame": {"x":191,"y":592,"w":27,"h":56} }, {"filename": "backimage", "frame": {"x":226,"y":593,"w":28,"h":55} }, {"filename": "backimage", "frame": {"x":261,"y":593,"w":30,"h":55} }, {"filename": "backimage", "frame": {"x":298,"y":593,"w":27,"h":54} } ] }, "openjacket":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":656,"w":26,"h":56} }, {"filename": "backimage", "frame": {"x":154,"y":656,"w":25,"h":56} }, {"filename": "backimage", "frame": {"x":187,"y":658,"w":25,"h":54} }, {"filename": "backimage", "frame": {"x":219,"y":658,"w":29,"h":54} }, {"filename": "backimage", "frame": {"x":256,"y":658,"w":28,"h":54} }, {"filename": "backimage", "frame": {"x":292,"y":658,"w":29,"h":54} } ] }, "handmoves":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":466,"w":25,"h":54} }, {"filename": "backimage", "frame": {"x":153,"y":466,"w":28,"h":54} }, {"filename": "backimage", "frame": {"x":189,"y":465,"w":45,"h":55} }, {"filename": "backimage", "frame": {"x":242,"y":467,"w":25,"h":53} }, {"filename": "backimage", "frame": {"x":275,"y":469,"w":34,"h":51} }, {"filename": "backimage", "frame": {"x":317,"y":466,"w":28,"h":54} } ] }, "smalljump":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":720,"w":25,"h":56} }, {"filename": "backimage", "frame": {"x":153,"y":721,"w":29,"h":55} }, {"filename": "backimage", "frame": {"x":190,"y":721,"w":34,"h":55} }, {"filename": "backimage", "frame": {"x":232,"y":721,"w":32,"h":55} }, {"filename": "backimage", "frame": {"x":272,"y":721,"w":27,"h":55} }, {"filename": "backimage", "frame": {"x":307,"y":720,"w":25,"h":56} }, {"filename": "backimage", "frame": {"x":340,"y":721,"w":25,"h":55} }, {"filename": "backimage", "frame": {"x":373,"y":721,"w":25,"h":55} }, {"filename": "backimage", "frame": {"x":406,"y":722,"w":25,"h":54} }, {"filename": "backimage", "frame": {"x":439,"y":709,"w":21,"h":70} }, {"filename": "backimage", "frame": {"x":472,"y":730,"w":28,"h":46} } ] }, "bigmove":{"frames": [{"filename": "backimage", "frame": {"x":16,"y":1473,"w":27,"h":63} }, {"filename": "backimage", "frame": {"x":51,"y":1479,"w":34,"h":57} }, {"filename": "backimage", "frame": {"x":93,"y":1480,"w":34,"h":56} }, {"filename": "backimage", "frame": {"x":135,"y":1480,"w":34,"h":56} }, {"filename": "backimage", "frame": {"x":177,"y":1480,"w":42,"h":56} }, {"filename": "backimage", "frame": {"x":227,"y":1481,"w":42,"h":55} }, {"filename": "backimage", "frame": {"x":277,"y":1481,"w":40,"h":55} }, {"filename": "backimage", "frame": {"x":325,"y":1481,"w":39,"h":55} }, {"filename": "backimage", "frame": {"x":372,"y":1481,"w":38,"h":55} }, {"filename": "backimage", "frame": {"x":418,"y":1481,"w":34,"h":55} }, {"filename": "backimage", "frame": {"x":460,"y":1481,"w":34,"h":55} }, {"filename": "backimage", "frame": {"x":502,"y":1481,"w":34,"h":55} }, {"filename": "backimage", "frame": {"x":544,"y":1482,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":586,"y":1480,"w":34,"h":56} }, {"filename": "backimage", "frame": {"x":628,"y":1480,"w":42,"h":56} }, {"filename": "backimage", "frame": {"x":678,"y":1479,"w":38,"h":57} }, {"filename": "backimage", "frame": {"x":724,"y":1480,"w":34,"h":56} }, {"filename": "backimage", "frame": {"x":726,"y":1481,"w":37,"h":55} }, {"filename": "backimage", "frame": {"x":813,"y":1480,"w":34,"h":56} }, {"filename": "backimage", "frame": {"x":855,"y":1479,"w":34,"h":57} }, {"filename": "backimage", "frame": {"x":939,"y":1479,"w":38,"h":57} }, {"filename": "backimage", "frame": {"x":985,"y":1479,"w":35,"h":57} }, {"filename": "backimage", "frame": {"x":1028,"y":1479,"w":39,"h":57} }, {"filename": "backimage", "frame": {"x":1075,"y":1479,"w":34,"h":57} }, {"filename": "backimage", "frame": {"x":1117,"y":1477,"w":34,"h":59} }, {"filename": "backimage", "frame": {"x":1159,"y":1480,"w":46,"h":56} }, {"filename": "backimage", "frame": {"x":1213,"y":1481,"w":44,"h":55} }, {"filename": "backimage", "frame": {"x":1265,"y":1481,"w":45,"h":55} }, {"filename": "backimage", "frame": {"x":1318,"y":1482,"w":46,"h":54} }, {"filename": "backimage", "frame": {"x":1372,"y":1482,"w":42,"h":54} }, {"filename": "backimage", "frame": {"x":1422,"y":1483,"w":43,"h":53} }, {"filename": "backimage", "frame": {"x":1473,"y":1482,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":1515,"y":1481,"w":46,"h":54} }, {"filename": "backimage", "frame": {"x":1569,"y":1482,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":1613,"y":1482,"w":35,"h":54} }, {"filename": "backimage", "frame": {"x":1656,"y":1482,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":1698,"y":1482,"w":36,"h":54} }, {"filename": "backimage", "frame": {"x":1742,"y":1482,"w":44,"h":54} }, {"filename": "backimage", "frame": {"x":1794,"y":1482,"w":39,"h":54} }, {"filename": "backimage", "frame": {"x":16,"y":1554,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":58,"y":1554,"w":39,"h":54} }, {"filename": "backimage", "frame": {"x":105,"y":1554,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":147,"y":1554,"w":34,"h":54} }, {"filename": "backimage", "frame": {"x":188,"y":1555,"w":46,"h":53} }, {"filename": "backimage", "frame": {"x":242,"y":1554,"w":53,"h":54} }, {"filename": "backimage", "frame": {"x":303,"y":1549,"w":52,"h":59} }, {"filename": "backimage", "frame": {"x":363,"y":1545,"w":39,"h":63} }, {"filename": "backimage", "frame": {"x":410,"y":1543,"w":35,"h":65} }, {"filename": "backimage", "frame": {"x":453,"y":1551,"w":34,"h":57} } ] }, "spin":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":528,"w":25,"h":56} }, {"filename": "backimage", "frame": {"x":153,"y":529,"w":29,"h":55} }, {"filename": "backimage", "frame": {"x":190,"y":529,"w":34,"h":55} }, {"filename": "backimage", "frame": {"x":232,"y":529,"w":32,"h":55} }, {"filename": "backimage", "frame": {"x":272,"y":529,"w":27,"h":55} }, {"filename": "backimage", "frame": {"x":307,"y":528,"w":25,"h":55} }, {"filename": "backimage", "frame": {"x":340,"y":529,"w":29,"h":54} }, {"filename": "backimage", "frame": {"x":373,"y":529,"w":25,"h":55} }, {"filename": "backimage", "frame": {"x":406,"y":529,"w":26,"h":55} }, {"filename": "backimage", "frame": {"x":440,"y":528,"w":25,"h":56} }, {"filename": "backimage", "frame": {"x":473,"y":519,"w":26,"h":65} } ] }, "andarcostas":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":27,"w":25,"h":53} }, {"filename": "backimage", "frame": {"x":161,"y":26,"w":25,"h":54} }, {"filename": "backimage", "frame": {"x":192,"y":24,"w":23,"h":56} }, {"filename": "backimage", "frame": {"x":223,"y":24,"w":23,"h":56} }, {"filename": "backimage", "frame": {"x":254,"y":26,"w":23,"h":54} }, {"filename": "backimage", "frame": {"x":285,"y":24,"w":23,"h":56} }, {"filename": "backimage", "frame": {"x":316,"y":25,"w":23,"h":55} } ] }, "touchingknee":{"frames": [{"filename": "backimage", "frame": {"x":120,"y":402,"w":25,"h":54} }, {"filename": "backimage", "frame": {"x":153,"y":402,"w":37,"h":54} }, {"filename": "backimage", "frame": {"x":191,"y":402,"w":37,"h":54} }, {"filename": "backimage", "frame": {"x":236,"y":401,"w":36,"h":55} }, {"filename": "backimage", "frame": {"x":280,"y":402,"w":35,"h":54} }, {"filename": "backimage", "frame": {"x":323,"y":402,"w":39,"h":54} }, {"filename": "backimage", "frame": {"x":370,"y":402,"w":30,"h":54} }, {"filename": "backimage", "frame": {"x":408,"y":403,"w":25,"h":53} }, {"filename": "backimage", "frame": {"x":440,"y":402,"w":26,"h":54} }, {"filename": "backimage", "frame": {"x":474,"y":402,"w":25,"h":54} } ] } }';
     var mjAnimInfo = null;
    //Game Contructor
    var actualFrame = 0;
    var fps = 0;
    var danceMove = null;
    var canChangeMove = true;
    function Character(){
        Object.defineProperties(this, {
            // rewritable at the moment of load, it holds the default type chosen for fallback purposes in the future
            defaultType: {
                value: "game-engine",
                writable: false
            },
            id: {
                value: null,
                writable: true
            },
            createId: {
                value: function() {
                  function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                  }
                  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +s4() + '-' + s4() + s4() + s4();
                },
                writable: false,
                enumerable: false
            },
            load: {
                value: function(type) {
                    
                },
                enumerable: true
            }
        });
        this.id = this.createId();

        mjAnimInfo = JSON.parse(mjFrameAnim);
        danceMove = mjAnimInfo.default;
        //console.log(mjAnimInfo)
    }

    Character.prototype.init = function(first_argument) {
        danceMove = mjAnimInfo.default;
        actualFrame = 0;
        beatit.play();
    };

    Character.prototype.destroy = function(first_argument) {
    	//console.log('Destroy Character id:',this.id);
        beatit.pause();
    };

    Character.prototype.update = function(canvasContext) {
        canvasContext.save(); 
        var info = danceMove.frames[actualFrame];
        if (info!=null && info.frame) {
            canvasContext.drawImage(mjallsprite, info.frame.x, info.frame.y,info.frame.w,info.frame.h,Math.round(300-(info.frame.w/2)),Math.round(380-info.frame.h),info.frame.w,info.frame.h) ;
        };
        
        //canvasContext.translate( 500 * -0.5, canvasContext.measureText(txt).height * -0.5 );
        canvasContext.restore();
        if (fps===8) {
            fps = 0;
            actualFrame++;
            if (actualFrame>=danceMove.frames.length) {
                actualFrame = 0;
                canChangeMove = true;
                danceMove = mjAnimInfo.default;
                var random = Math.floor((Math.random() * 100) + 1);
                if (random>65 && random<85) {
                    danceMove = mjAnimInfo.openjacket;
                } else if (random>85) {
                    danceMove = mjAnimInfo.handmoves;
                };
            }
        };        
        fps++;
    }

    Character.prototype.keyboardEvent = function(code) {
        if (canChangeMove) {
            if (code==81) {
            danceMove = mjAnimInfo.touchingknee;
            };
            if (code==80) {
                danceMove = mjAnimInfo.bigmove;
            };
            if (code==79) {
                danceMove = mjAnimInfo.spin;
            };
            if (code==87) {
                danceMove = mjAnimInfo.handmoves;
            }; 
        };
        //canChangeMove = false;
    }

    //// CLASS DEFAULT
    Character.prototype.addEventListener = function(a,b){
      'use strict';
        if(this.addEventListener){
            this[a] = b;
            //this.addEventListener(type,handler,false);
        }else if(this.attachEvent && htmlEvents['on'+a]){// IE < 9
            this.attachEvent('on'+a,b);
        }else{
            this['on'+a]=b;
        }
        //this[a] = b;
    };
    Character.prototype.removeEventListener = function(a,b){
        'use strict';
      this[a] = null;
      b = null;
    };
    Character.prototype.dispatchEvent = function(eventName,data){
        'use strict';
        var event;
        if(document.createEvent){
            event = document.createEvent('HTMLEvents');
            event.initEvent(eventName,true,true);
        }else if(document.createEventObject){// IE < 9
            event = document.createEventObject();
            event.eventType = eventName;
        } else {
            //console.log('c');
        }
        event.eventName = eventName;
        event.keyCode = data.keyCode;
        event.shiftKey =  data.shiftKey;
        event.ctrlKey =  data.ctrlKey;
        if(this.dispatchEvent){
            var callFunctionOn = this[event.eventName];
            try{
              callFunctionOn(event);
            }
            catch(err){
              console.log('Error:',err);
            }
            //this.dispatchEvent(event);
        }else if(this.fireEvent && htmlEvents['on'+eventName]){// IE < 9
            this.fireEvent('on'+event.eventType,event);// can trigger only real event (e.g. 'click')
        }else if(this[eventName]){
            this[eventName]();
        }else if(el['on'+eventName]){
            this['on'+eventName]();
        }    
    };
    return Character;
});