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
        this.load.image("background", "assets/background.png");

    };

    Menu.prototype.create = function(){
        this.background = this.add.sprite(0,0,"background");
    };


    return new Menu();
});