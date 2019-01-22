/* 
Author: Pedro Martins
email: pedro.martins@pixelkiller.net
Date: 07/2015
*/
require(['app', 'jquery','moonhero'], function (app,jquery,moonhero) {
    'use strict';
    // use app here
    // app -> init config
    app.init();

    if (typeof requirejs === 'function') {
	    requirejs(['moonhero'],function(module){
            module.init();
        });
	}    
});