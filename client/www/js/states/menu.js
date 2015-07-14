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

        this.load.spritesheet('buttonLeft', 'assets/mainmenu/left.png', 32, 120, 2);
        this.load.spritesheet('buttonRight', 'assets/mainmenu/right.png', 32, 120, 2);
        this.load.spritesheet('buttonInventory', 'assets/mainmenu/buttonInventory.png', 128, 128, 2);

    };

    Menu.prototype.create = function(){
        this.app.background = this.add.sprite(0,0,'background');
        this.app.scaleToScreen(this.app.background);

        var robot = this.app.makeRobot();
        robot.x = this.game.world.centerX;
        robot.y = this.game.world.centerY;

        this.logo = this.app.add('sprite', this.world.centerX, this.world.centerY - (this.app.height / 3), 'logo');
        this.logo.anchor.set(0.5);

        this.buttonLeft = this.app.add('button',this.world.centerX - (this.world.centerX * 0.9), this.world.centerY, 'buttonLeft', this.goFight, this, 0, 0, 1, 1);
        this.buttonLeft.anchor.set(0.5);
        this.buttonRight = this.app.add('button',this.world.centerX + (this.world.centerX * 0.9), this.world.centerY, 'buttonRight', this.goScan, this, 0, 0, 1, 1);
        this.buttonRight.anchor.set(0.5);
        this.buttonInventory = this.app.add('button',this.world.centerX, this.world.centerY + (this.world.centerY * 0.7)  , 'buttonInventory', this.goInventory, this, 0, 0, 1, 1);
        this.buttonInventory.anchor.set(0.5);
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