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
        this.app = require('app');
    };

    Menu.prototype.preload = function(){
        this.app.load('image','background', 'mainmenu/background.png');
        this.app.load('image', 'logo', 'mainmenu/logo.png');

    };

    Menu.prototype.create = function(){
        this.background = this.add.sprite(0,0,'background');

        var heightRatio = this.app.height/this.background.height;
        this.background.height = this.app.height;
        this.background.width = this.background.width * heightRatio;

        this.logo = this.add.sprite(this.world.centerX, this.world.centerY - (this.app.height / 3), 'logo');
        this.logo.anchor.set(0.5);
    };


    return new Menu();
});