/**
 * Created by janimo on 10.07.2015.
 */
define([
    'states/BaseState',
    'gameobjects/TileBox'
],function(BaseState,TileBox) {
    'use strict';


    function Inventory() {
        BaseState.call(this);
    }

    Inventory.prototype = Object.create(BaseState.prototype);
    Inventory.prototype.constructor = Inventory;


    Inventory.prototype.init = function(){
        BaseState.prototype.init.call(this);

        this.titleContainer = null;
        this.background = null;
        this.filter = null;


    };

    Inventory.prototype.preload = function(){
    };

    Inventory.prototype.create = function(){

        this.filter = new Phaser.Filter(this.app.game, {timeN: { type: '1f', value: 0 }}, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);
        this.background = this.add.sprite(0,0);
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

        this.titleContainer = new TileBox(this.app.game,{
            topLeft: 'alertTL',
            topRight: 'alertTR',
            top: 'alertT',
            left: 'alertL',
            center: 'alertM',
            right: 'alertR',
            bottomLeft: 'alertBL',
            bottomRight: 'alertBR',
            bottom: 'alertB'
        },30,this.app.width-60,0);

        this.titleContainer.x = 0;
        this.titleContainer.y = 0;

        var titleText = this.app.game.add.text(this.world.centerX,30,'Inventar',{font: "35px bitwise",fill: '#ffffff',align: 'center'});
        titleText.anchor.set(0.5);
        this.titleContainer.add(titleText);
        this.titleContainer.forEach(function(e){
            e.alpha = 0.7;
        },this);

        var menuButton = this.app.game.add.text(10,2,'<',{font: "50px vt323regular",fill: '#ffffff',align: 'center'});
        this.titleContainer.add(menuButton);
        this.createOnClick(menuButton,function(){
            this.app.startState('Menu');
        });
    };

    return new Inventory();
});