define(['board'], function() {
    'use strict';

    var increment = 0;
    var textColor = '#000000';
    var fontsize = '24px Arial';
    var defaultText = '';
    var timebarWidth = 600;
    var timebarStart = 0;
    var timebarEnd = 0;
    var actualCredits = 0;
    var betCredits = 0;
    var steps = [];
    var stepCode = null;
    var canvasCtx = null;
    var keysRef = {};
    var lastupdate = 0;
    var colors = ['red','black','blue'];
    var indexColor = 0;
    var gameStart = false;
    var timeToResponde = 0;
    //Board Contructor
    function Board(){
    	Object.defineProperties(this, {
            // rewritable at the moment of load, it holds the default type chosen for fallback purposes in the future
            defaultType: {
                value: "game-board",
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
        keysRef[79] = 'O';
        keysRef[80] = 'P';
        keysRef[81] = 'Q';
        keysRef[87] = 'W';
    }

    Board.prototype.init = function(value) {
    	var instance = this;
    	console.log('init board');
    	console.log('ID:',this.id);
    	instance.show(value);
    	timeToResponde = 2000;

    	goplay.addEventListener('click', function(ev){
    		if (mybet.value<=actualCredits) {
    			actualCredits -= mybet.value;
    		} else {
    			return false;
    		}
    		timeToResponde = 2000;
    		$(credits).text(actualCredits);
    		instance.dispatchEvent('updateCredits',{credits:actualCredits});
    		instance.dispatchEvent('characeterView');
    		instance.stepGenerator(mybet.value);
    		instance.stepManager(mybet.value);
    		$(betView).addClass('hide');
    		gameStart = true;
    	});
    	
    	backMenu.addEventListener('click', function(ev){
    		instance.dispatchEvent('goHome',ev);
    	});
    };

    Board.prototype.keyboardEvent = function(code) {
    	var instance = this;
    	if (!gameStart) {
    		return false;
    	};
    	var mySteps = 20-steps.length-1;
    	if (mySteps==19) {
    		instance.dispatchEvent('loose');
	        instance.checkBet('You Sucess to hit All moves');
    		return false;
    	};
        if (code===stepCode) {
        	if (colors.length>0) {
        		colors.push(colors.shift());
        	};        	        	
        	canvasCtx.clearRect(0,0,600,400);
        	instance.stepManager();
        } else {
        	gameStart = false;
        	instance.dispatchEvent('loose');
	        instance.checkBet('You fail to hit :'+defaultText);
        }
    }

    Board.prototype.show = function(value){
    	$(betView).removeClass('hide');
    	$(credits).text(value);
    	actualCredits = value;
    }

    Board.prototype.destroy = function(first_argument) {
    	console.log('---DESTROY---');
    	//backMenu.removeEventListener('click', backMenu['click']);
    };

    Board.prototype.update = function(canvasContext,data) {
    	increment++;
    	canvasCtx = canvasContext;    	
    	this.createViewTime(canvasCtx,data);
    	canvasCtx.save();
        canvasCtx.font=fontsize;
        canvasCtx.fillStyle=textColor;
        canvasCtx.fillText('Press:'+defaultText,10,350,200);
        canvasCtx.restore();
        lastupdate = data.now;
    };

    Board.prototype.stepGenerator = function(betvalue) {
    	betCredits = betvalue;
    	steps = [];
    	var keys = [79,80,81,87];
    	for (var i = 20 - 1; i >= 0; i--) {
    		var pos = Math.floor((Math.random() * keys.length) + 0);
    		steps.push(keys[pos]);
    	};
    };

    Board.prototype.stepManager = function(betvalue) {
    	var instance = this;
    	if (steps.length>0) {    		
    		instance.stepExecute(steps[0],betvalue);
    		steps.shift();
    	};
    };

    Board.prototype.stepExecute = function(step,betvalue) {
    	stepCode = step;
    	defaultText = keysRef[step];
    	timebarStart = lastupdate;
    	timeToResponde = timeToResponde*.9;
    	var timeScale = timeToResponde;
    	timebarEnd = timebarStart+timeScale;
    };


    Board.prototype.showView = function(first_argument) {
    	// body...
    };
    Board.prototype.hideView = function(first_argument) {
    	// body...
    };

    Board.prototype.createViewTime = function(canvasContext,data) {
    	//data.dt
    	var instance = this;
        var diferenc = timebarEnd-data.now;
        var total = timebarEnd-timebarStart;
        if(diferenc>0){
	        var percent = diferenc/total;
	        var wLeft = timebarWidth*(percent);
	    	canvasContext.fillStyle=colors[0];
			canvasContext.fillRect(0, 0, wLeft, 10);
        } else if(gameStart){
        	gameStart = false;
        	canvasContext.clearRect(0,0,600,10);
        	instance.dispatchEvent('loose');        	   	
        	instance.checkBet('You fail to push button on Time:');
        }        
    };

    Board.prototype.checkBet = function(message) {
    	var instance = this;
    	//instance.dispatchEvent('loose');
    	 var mySteps = 20-steps.length-1;
    	 canvasCtx.save();
        canvasCtx.font=fontsize;
        canvasCtx.fillStyle=textColor;  

        canvasCtx.fillText(message,140,160);

        var txtAchivement = 'Total Steps :'+mySteps;
        var AchivWidth = Math.round(canvasCtx.measureText(txtAchivement).width/2);
        canvasCtx.fillText(txtAchivement,300-AchivWidth,200);
        var feedback = null;
        if (mySteps<10) {
        	feedback = 'You loose you bet';
        } else if (mySteps>=10 && mySteps<18) {
        	feedback = 'You win,'+betCredits*2;
        	actualCredits +=betCredits*2;
        	instance.dispatchEvent('updateCredits',{credits:actualCredits});
        } else if (mySteps>=18) {
        	feedback = 'Excellent, win '+betCredits*5;
        	actualCredits +=betCredits*5;
        	instance.dispatchEvent('updateCredits',{credits:actualCredits});
        };
        var feedwidth = Math.round(canvasCtx.measureText(feedback).width/2);
        canvasCtx.fillText(feedback,300-feedwidth,230);
        canvasCtx.fillText('Press esc to go back to Menu',150,270);
        canvasCtx.restore();
    };

    Board.prototype.removeView = function(first_argument) {
    	// body...
    };

    //*****************************//
    Board.prototype.addEventListener = function(a,b){
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
    Board.prototype.removeEventListener = function(a,b){
        'use strict';
      this[a] = null;
      b = null;
    };
    Board.prototype.dispatchEvent = function(eventName,data){
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
        	if(data.credits){
        		event.credits = data.credits;
        	} else if (event.keyCode) {
        		event.keyCode = data.keyCode;
		        event.shiftKey =  data.shiftKey;
		        event.ctrlKey =  data.ctrlKey;
        	};	       
	    }

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
    return Board;
});