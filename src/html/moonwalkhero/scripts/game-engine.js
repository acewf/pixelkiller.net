/* 
Author: Pedro Martins
email: pedro.martins@pixelkiller.net
Date: 07/2015
*/
var fps = {
    startTime : 0,
    frameNumber : 0,
    getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
            currentTime = ( d - this.startTime ) / 1000,
            result = Math.floor( ( this.frameNumber / currentTime ) );

        if( currentTime > 1 ){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;

    }   
};
define(['game','board','character'], function(game,Board,Character) {
    var boardresults = null;
    var credits = 1000;
    var canvasContext = null;
    
    var itemsToRender = [];
    var mj = null;
    var lastTime;

    //Game Contructor
    function Game(){
        var instance = this;
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
        this.renderByFrame = false;
        this.addEventListener('keyboardEvent',function(ev){
            if (ev.keyCode===27) {
                instance.renderByFrame = false;
                if (mj) {
                    mj.destroy();
                };
                
                instance.goBackHome(ev);
            };
            if (ev.keyCode===81 || ev.keyCode===80 || ev.keyCode===79 || ev.keyCode===87) {
                mj.keyboardEvent(ev.keyCode);
                boardresults.keyboardEvent(ev.keyCode);
            }
        });
    }
    
    Game.prototype.init = function(ctx) {
        var instance = this;
    	canvasContext = ctx;
        console.log('CTX:>',ctx);
        console.log('Init Game');
        console.log('ID:',this.id);

        if (boardresults===null) {
            boardresults = new Board();
            boardresults.addEventListener('goHome',function(ev){
                instance.goBackHome(ev);
                instance.renderByFrame = false;
                if (mj) {
                    mj.destroy();
                }
            });
            boardresults.addEventListener('updateCredits',function(ev){
                instance.updateCredits(ev);
            });
            boardresults.addEventListener('loose',function(ev){
                console.log('LOOOSE');
                instance.renderByFrame = false;
                mj.destroy();
            });
            boardresults.addEventListener('characeterView',function(ev){
                if (mj!=null) {
                    instance.startGame();
                };
                instance.addCharaceterView(ev);
            });
            boardresults.init(credits);
            itemsToRender.push(boardresults);
        };
    };
    Game.prototype.show = function() {
        boardresults.show(credits);
    }

    Game.prototype.destroy = function(first_argument) {
    	var instance = this;
        this.renderByFrame = false;
        //boardresults.destroy();
        //boardresults = null;
    };
    Game.prototype.startGame = function(first_argument) {
        console.log('startGame');
        this.renderByFrame = true;
        this.loop(window);
    };
    Game.prototype.goBackHome = function(ev) {
        var instance = this;
        instance.dispatchEvent('showMenu');  
    };

    Game.prototype.updateCredits = function(value) {
        credits = value.credits;
    }
    Game.prototype.addCharaceterView = function() {
        var instance = this;
        if (mj===null) {
            mj = new Character();
            itemsToRender.push(mj);
        };
        mj.init();
        
        instance.renderByFrame = true;
        instance.loop(window);
    }

    Game.prototype.loop = function(ev){
        var instance = this;
        var now = Date.now();
        var dt = (now - lastTime) / 1000.0;
        canvasContext.clearRect( 0, 0, W, H );
        for (var i = itemsToRender.length - 1; i >= 0; i--) {
            itemsToRender[i].update(canvasContext,{now:now,dt:dt});
        };
        this.dispatchEvent('render');
        lastTime = now;
        window.requestAnimationFrame(function(){
            if(instance.renderByFrame){
                instance.loop(window);
            }
        });
    }

    ////////***********************////////

    Game.prototype.addEventListener = function(a,b){
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
    Game.prototype.removeEventListener = function(a,b){
        'use strict';
      this[a] = null;
      b = null;
    };
    Game.prototype.dispatchEvent = function(eventName,data){
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
        if (data) {
            event.eventName = eventName;
            event.keyCode = data.keyCode;
            event.shiftKey =  data.shiftKey;
            event.ctrlKey =  data.ctrlKey;
        };
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
    return Game;
    
});