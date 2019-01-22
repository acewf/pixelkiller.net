/* 
Author: Pedro Martins
email: pedro.martins@pixelkiller.net
Date: 07/2015
*/
define(['moonhero','keyboard','game'], function(moonhero,keyboard,GameClass) {
    var game = null;
    //Application Contructor  
    function MoonHero(){
        Object.defineProperties(this, {
            defaultType: {
                value: "game-application",
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
            version: {
                value: "0.1"
            },
            bowserInfo: {
                value: function(){
                    return {
                        get_browser:function(){
                            var N=navigator.appName, ua=navigator.userAgent, tem;
                            var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
                            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
                            M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
                            return M[0];
                        },
                        get_browser_version:function(){
                            var N=navigator.appName, ua=navigator.userAgent, tem;
                            var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
                            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
                            M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
                            return M[1];
                        }
                    }
                },
                writable: true,
                enumerable: true
            },
            load: {
                value: function(type) {
                    
                },
                enumerable: true
            }
        });

        // Instance of Module added to application
        this.moduleRunning = null;
        // Application UID
        this.id = this.createId();
        this.canvasContext = null;
        this.keyboard = new keyboard();
    }

    //Application initializer  
    MoonHero.prototype.init = function(first_argument) {
    	// body...
        console.log('Init MoonHero Application');
        console.log('ID:',this.id);

        this.createListeners();
        this.showMenu(null);        
        this.CanvasRender(null);
    };

    //Application destroy 
    MoonHero.prototype.destroy = function(first_argument) {
    	// body...
    };

    //Application Add Global Listeners
    MoonHero.prototype.createListeners = function() {
        var instance = this;
        instance.keyboard.addEventListener('keydown',instance.keyboardEvent);
        instructionsbt.addEventListener('click',function(ev){
            instance.showInstructions(ev);
        });
        playbt.addEventListener('click',function(ev){
            console.log()
            instance.playGame(ev,instance);
        });
    };

    //Application Remove Global Listeners
    MoonHero.prototype.removeListeners = function(first_argument) {
    	// body...
    };

    //  KeyBoard Event Dispatch
    MoonHero.prototype.keyboardEvent = function(ev) {
        if (game) {
            game.dispatchEvent('keyboardEvent',ev);
        };
    };

    //Application Add Global Listeners
    MoonHero.prototype.showMenu = function(ev,func) {
        if (ev) {
            goback.removeEventListener(ev.type,func);
        };
        $(menuView).removeClass('hide');
        $(instructionsView).addClass('hide');
        $(betView).addClass('hide');
    }

    //  KeyBoard Event Dispatch
    MoonHero.prototype.showInstructions = function(ev) {
        var instance = this;
        $(menuView).addClass('hide');
        $(instructionsView).removeClass('hide');
        var temp = function(ev){
            instance.showMenu(ev,temp);
        }
        goback.addEventListener('click',temp);
    };

    //  KeyBoard Event Dispatch
    MoonHero.prototype.playGame = function(ev,instance) {
        //var instance = this;
        $(menuView).addClass('hide');
        $(instructionsView).addClass('hide');
        if (game==null) {
            game = new GameClass();
            game.addEventListener('render',function(ev){
                instance.CanvasDraw();
            });
            game.addEventListener('showMenu',function(ev){
                instance.ClearDraw();
                instance.showMenu(ev);
            })
            console.log('playGame_:',instance)
            game.init(instance.canvasContext);
        } else {
            game.show();
        }
    };

    //Application Global Render to Canvas
    MoonHero.prototype.CanvasRender = function (argument) {
        var instance = this;
        //instance.canvasContext.clearRect(0, 0, instance.W, instance.H);
        var browser=instance.bowserInfo().get_browser();
        var browser_version=instance.bowserInfo().get_browser_version();
        if (!((browser=='Firefox') ||  (browser=='MSIE') ||  (browser=='Safari'))) {
            W = gamecanvas.offsetWidth, H = gamecanvas.offsetHeight;
            instance.canvasContext  = gamecanvas.getContext("2d");
            gamecanvas.width = W;
            gamecanvas.height = H;
        } else {
            W = gamecanvas.offsetWidth, H = gamecanvas.offsetHeight;
            instance.canvasContext  = gamecanvas.getContext("2d");
            gamecanvas.width = W;
            gamecanvas.height = H;
        }
    }
    MoonHero.prototype.CanvasDraw = function (argument) {
        var instance = this;
        //instance.canvasContext.clearRect( 0, 0, W, H );
        //instance.canvasContext.fillStyle = "rgba(0, 0, 0, 1)";
        //instance.canvasContext.fillRect(0, 0, W, H);
    }
    MoonHero.prototype.ClearDraw = function (argument) {
        var instance = this;
        instance.canvasContext.clearRect( 0, 0, W, H );
        //instance.canvasContext.fillStyle = "rgba(0, 0, 0, 1)";
        //instance.canvasContext.fillRect(0, 0, W, H);
    }


    //Application Create Instance
    var moonhero = new MoonHero();

    return moonhero;
});