/**
 * Created by janimo on 10.07.2015.
 */
'use strict';

define(function() {

    function Inventory() {
        this.app = null;
    }

    Inventory.prototype = Object.create(Phaser.State.prototype);
    Inventory.prototype.constructor = Inventory;


    Inventory.prototype.init = function(){
        this.app = require('app');
    };

    Inventory.prototype.preload = function(){
        this.load.spritesheet('buttonBack', 'assets/buttonBack.png', 128, 128, 2);
        this.load.image('inventoryLogo', 'assets/inventory/inventoryLogo.png');
    };

    Inventory.prototype.create = function(){
        this.inventoryLogo = this.app.add('sprite', this.world.centerX, this.world.centerY - (this.app.height / 3), 'inventoryLogo');
        this.inventoryLogo.anchor.set(0.5);
        this.buttonBack = this.app.add('button',this.world.centerX / 4, this.world.centerX / 4, 'buttonBack', this.goBack, this, 0, 0, 1, 1);
        this.buttonBack.anchor.set(0.5);
        this.buttonBack.scale.setTo(0.5, 0.5);
    };

    Inventory.prototype.goBack = function(){
        this.app.game.state.start("Menu");
    };

    return new Inventory();
});