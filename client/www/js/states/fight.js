/**
 * Created by janimo on 10.07.2015.
 */
'use strict';

define(function() {

    function Fight() {
        this.app = null;
    }

    Fight.prototype = Object.create(Phaser.State.prototype);
    Fight.prototype.constructor = Fight;


    Fight.prototype.init = function(){
        this.app = require('app');
    };

    Fight.prototype.preload = function(){
        this.load.spritesheet('buttonBack', 'assets/buttonBack.png', 128, 128, 2);
        this.load.image('fightLogo', 'assets/fight/fightLogo.png');
    };

    Fight.prototype.create = function(){
        this.fightLogo = this.app.add('sprite', this.world.centerX, this.world.centerY - (this.app.height / 3), 'fightLogo');
        this.fightLogo.anchor.set(0.5);
        this.buttonBack = this.app.add('button',this.world.centerX / 4, this.world.centerX / 4, 'buttonBack', this.goBack, this, 0, 0, 1, 1);
        this.buttonBack.anchor.set(0.5);
        this.buttonBack.scale.setTo(0.5, 0.5);
    };

    Fight.prototype.goBack = function(){
        this.app.game.state.start("Menu");
    };

    return new Fight();
});