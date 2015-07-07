'use strict';

define(function(){

    function Boot(){
        this.app = null;

    }

    Boot.prototype = new Phaser.State();

    Boot.prototype.init = function(){
        this.app = require('app');
        this.app.canvas = document.getElementsByTagName('canvas')[0]
        this.app.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.app.game.scale.pageAlignVertically = true;
        this.app.game.scale.pageAlignHorizontally = true;

        console.log(this);
    };

    Boot.prototype.create = function(){

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = this.add.text(this.world.centerX, this.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);

        text.anchor.set(0.5);
    };

    Boot.prototype.render = function() {

        var x = 32;
        var y = 0;
        var yi = 32;

        this.app.game.debug.text('Viewport', x, y += yi);

        this.app.game.debug.text('Viewport Width: ' + this.app.game.scale.viewportWidth, x, y += yi);
        this.app.game.debug.text('window.innerWidth: ' + window.innerWidth, x, y += yi);
        this.app.game.debug.text('window.outerWidth: ' + window.outerWidth, x, y += yi);

        this.app.game.debug.text('Viewport Height: ' + this.app.game.scale.viewportHeight, x, y += yi);
        this.app.game.debug.text('window.innerHeight: ' + window.innerHeight, x, y += yi);
        this.app.game.debug.text('window.outerHeight: ' + window.outerHeight, x, y += yi);

        this.app.game.debug.text('Document', x, y += yi*2);

        this.app.game.debug.text('Document Width: ' + this.app.game.scale.documentWidth, x, y += yi);
        this.app.game.debug.text('Document Height: ' + this.app.game.scale.documentHeight, x, y += yi);

        //  Device: How to get device size.

        //  Use window.screen.width for device width and window.screen.height for device height. 
        //  .availWidth and .availHeight give you the device size minus UI taskbars. (Try on an iPhone.) 
        //  Device size is static and does not change when the page is resized or rotated.

        x = 350;
        y = 0;

        this.app.game.debug.text('Device', x, y += yi);

        this.app.game.debug.text('window.screen.width: ' + window.screen.width, x, y += yi);
        this.app.game.debug.text('window.screen.availWidth: ' + window.screen.availWidth, x, y += yi);
        this.app.game.debug.text('window.screen.height: ' + window.screen.height, x, y += yi);
        this.app.game.debug.text('window.screen.availHeight: ' + window.screen.availHeight, x, y += yi);

    }

    return Boot;
});