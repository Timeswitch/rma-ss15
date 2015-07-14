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
        this.load.image('background', 'assets/mainmenu/background.png');
        this.load.image('logo', 'assets/mainmenu/logo.png');
        this.load.spritesheet('arrow_left', 'assets/mainmenu/left.png',32,120);
        this.load.spritesheet('arrow_right', 'assets/mainmenu/right.png',32,120);

    };

    Menu.prototype.create = function(){
        this.app.background = this.add.sprite(0,0,'background');
        this.app.scaleToScreen(this.app.background);

        this.logo = this.add.sprite(this.world.centerX, this.world.centerY - (this.app.height / 3), 'logo');
        this.logo.anchor.set(0.5);

        this.buttonLeft = this.add.button(this.world.centerX - (this.world.centerX * 0.9), this.world.centerY, 'arrow_left');
        this.buttonLeft.anchor.set(0.5);
        this.buttonRight = this.add.button(this.world.centerX + (this.world.centerX * 0.9), this.world.centerY, 'arrow_right');
        this.buttonRight.anchor.set(0.5);
    };
    Menu.prototype.goFight = function(){
        this.app.game.state.start('Fight');
    };
    Menu.prototype.goScan = function(){
        this.app.game.state.start('Scan');
    };
    Menu.prototype.goInventory = function(){
        this.app.game.state.start('Inventory');
    };


    return new Menu();
});