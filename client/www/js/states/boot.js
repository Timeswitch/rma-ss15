'use strict';

define([

    'states/menu',
    'states/scan',
    'states/fight',
    'states/inventory'

], function(Menu, Scan, Fight, Inventory){

    function Boot(){
        this.app = null;

    }

    Boot.prototype = new Phaser.State();

    Boot.prototype.preload = function(){
        //Roboteile laden...
        this.app.load('image','robobody_1','robotparts/body/body_1.png');
    };

    Boot.prototype.init = function(){
        this.app = require('app');
        this.app.canvas = document.getElementsByTagName('canvas')[0];
        this.app.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.app.game.scale.pageAlignVertically = true;
        this.app.game.scale.pageAlignHorizontally = true;

        console.log(this);
    };

    Boot.prototype.create = function(){

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = this.add.text(this.world.centerX, this.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);

        text.anchor.set(0.5);

        this.app.game.state.add('Menu', Menu);
        this.app.game.state.add('Scan', Scan);
        this.app.game.state.add('Fight', Fight);
        this.app.game.state.add('Inventory', Inventory);


        this.app.game.state.start("Menu");
    };

    return new Boot();
});