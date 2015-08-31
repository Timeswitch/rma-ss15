'use strict';

define([

    'states/Menu',
    'states/Scan',
    'states/Fight',
    'states/Inventory',
    'states/Friendlist'

], function(Menu, Scan, Fight, Inventory, Friendlist){

    function Boot(){
        this.app = null;

    }

    Boot.prototype = Object.create(Phaser.State.prototype);
    Boot.prototype.constructor = Boot;

    Boot.prototype.preload = function(){
        this.app.loadRoboParts();
    };

    Boot.prototype.init = function(){
        this.app = require('app');
        console.log(this.app);
        this.app.canvas = document.getElementsByTagName('canvas')[0];
        this.app.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.app.game.scale.pageAlignVertically = true;
        this.app.game.scale.pageAlignHorizontally = true;

        if(this.app.game.context != null){
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        }

        Phaser.Canvas.setImageRenderingCrisp(this.app.game.canvas);
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

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
        this.app.game.state.add('Friendlist', Friendlist);


        //this.app.game.state.start("Menu");
        this.app.initConnection();
    };

    return new Boot();
});