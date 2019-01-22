/* 
Author: Pedro Martins
email: pedro.martins@pixelkiller.net
*/
var require = {
    baseUrl: 'bower_components',
    paths: {
        main: '../scripts/main',
        app: '../scripts/app',
        moonhero: '../scripts/moon-hero',
        game: '../scripts/game-engine',
        board: '../scripts/board',
        keyboard: '../scripts/keyboard',
        character: '../scripts/character',
        jquery: 'jquery/dist/jquery',
    },
    shim: {
        board: {
            deps: [
                'jquery'
            ],
            exports: 'board'
        },
        game: {
            deps: [
                'jquery'
            ],
            exports: 'game'
        },
        moonhero: {
            deps: [
                'jquery'
            ],
            exports: 'moonhero'
        }
    },
    packages: []
};