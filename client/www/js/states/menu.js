/**
 * Created by janimo on 09.07.2015.
 */
'use strict';

define(function(){

    function Menu(){
        this.app = null;
    }

    Menu.prototype = new Phaser.State();

    Menu.prototype.init = function(){
        this.app = require("app");
    };

    Menu.prototype.preload = function(){
        this.app.load('image',"background", "mainmenu/background.png");

    };

    Menu.prototype.create = function(){
        this.background = this.add.sprite(0,0,"background");
        this.app.scaleToScreen(this.background);

        var robot = this.app.getRobot();
        robot.x = this.game.world.centerX;
        robot.y = this.game.world.centerY;
    };


    return new Menu();
});