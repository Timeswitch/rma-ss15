/**
 * Created by janimo on 10.07.2015.
 */
'use strict';

define(function() {

    function Scan() {
        this.app = null;
    }

    Scan.prototype = new Phaser.State();

    Scan.prototype.init = function(){
        this.app = require('app');
    };

    Scan.prototype.preload = function(){
        //this.load.spritesheet('buttonBack', 'assets/default/buttonBack.png', 128, 128, 2);
        this.load.spritesheet('buttonBack', 'assets/buttonBack.png', 128, 128,2);
        this.load.image('scanLogo', 'assets/scan/scanLogo.png');
    };

    Scan.prototype.create = function(){
        this.scanLogo = this.add.sprite(this.world.centerX, this.world.centerY - (this.app.height / 3), 'scanLogo');
        this.scanLogo.anchor.set(0.5);
        this.buttonBack = this.add.button(this.world.centerX / 4, this.world.centerX / 4, 'buttonBack', this.goBack, this, 0, 0, 1, 1);
        this.buttonBack.anchor.set(0.5);
        this.buttonBack.scale.setTo(0.5, 0.5);
    };

    Scan.prototype.goBack = function(){
        this.app.game.state.start("Menu");
    };

    return new Scan();
});