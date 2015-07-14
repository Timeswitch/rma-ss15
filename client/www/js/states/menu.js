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
        this.app.load('image','logo', 'mainmenu/logo.png');

        this.load.spritesheet('buttonFight', 'assets/default/mainmenu/buttonFight.png', 128, 128, 3);
        this.load.spritesheet('buttonScan', 'assets/default/mainmenu/buttonScan.png', 128, 128, 2);
        this.load.spritesheet('buttonInventory', 'assets/default/mainmenu/buttonInventory.png', 128, 128, 2);

    };

    Menu.prototype.create = function(){
        this.app.background = this.add.sprite(0,0,'background');
        this.app.scaleToScreen(this.app.background);

        var robot = this.app.makeRobot();
        robot.x = this.game.world.centerX;
        robot.y = this.game.world.centerY;

        this.logo = this.add.sprite(this.world.centerX, this.world.centerY - (this.app.height / 3), 'logo');
        this.logo.anchor.set(0.5);

        this.buttonFight = this.add.button(this.world.centerX - (this.world.centerX/2), this.world.centerY, 'buttonFight', this.goFight, this, 1, 1, 2, 2);
        this.buttonFight.anchor.set(0.5);
        this.buttonScan = this.add.button(this.world.centerX + (this.world.centerX/2), this.world.centerY, 'buttonScan', this.goScan, this, 0, 0, 1, 1);
        this.buttonScan.anchor.set(0.5);
        this.buttonInventory = this.add.button(this.world.centerX, this.world.centerY + (this.world.centerY * 0.7)  , 'buttonInventory', this.goInventory, this, 0, 0, 1, 1);
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