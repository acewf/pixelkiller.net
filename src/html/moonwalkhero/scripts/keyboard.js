/* 
Author: Pedro Martins
email: pedro.martins@pixelkiller.net
Date: 07/2015
*/
define(['keyboard'], function() {
    var listOfKeys = {};
    listOfKeys['37'] = true;
    listOfKeys['38'] = true;
    listOfKeys['39'] = true;
    listOfKeys['40'] = true;
    listOfKeys['79'] = true;
    listOfKeys['80'] = true;
    listOfKeys['81'] = true;
    listOfKeys['87'] = true;
    listOfKeys['32'] = true;
    listOfKeys['27'] = true;
    var htmlEvents = {// list of real events
        //<body> and <frameset> Events
        onload:1,
        onunload:1,
        //Form Events
        onblur:1,
        onchange:1,
        onfocus:1,
        onreset:1,
        onselect:1,
        onsubmit:1,
        //Image Events
        onabort:1,
        //Keyboard Events
        onkeydown:1,
        onkeypress:1,
        onkeyup:1,
        //Mouse Events
        onclick:1,
        ondblclick:1,
        onmousedown:1,
        onmousemove:1,
        onmouseout:1,
        onmouseover:1,
        onmouseup:1
    };

    //KeyBoard Contructor
    function KeyBoard(){
        var instance = this;
        console.log('CONSTRUCT KEYBOARD');
        window.addEventListener('keydown',function(ev){
            instance.parseEvent(ev,instance)
        });
    }

    KeyBoard.prototype.parseEvent = function(ev,instance){
        if (listOfKeys[ev.keyCode]) {
            this.dispatchEvent('keydown',ev);
        };
    }

    KeyBoard.prototype.addEventListener = function(a,b){
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
    KeyBoard.prototype.removeEventListener = function(a,b){
        'use strict';
      this[a] = null;
      b = null;
    };
    KeyBoard.prototype.dispatchEvent = function(eventName,data){
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
    return KeyBoard;
});