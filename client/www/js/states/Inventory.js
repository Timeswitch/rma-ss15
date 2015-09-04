/**
 * Created by janimo on 10.07.2015.
 */
define([
    'states/BaseState',
    'gameobjects/TileBox',
    'gameobjects/InventorylistItem'
],function(BaseState,TileBox,InventorylistItem) {
    'use strict';

    var recyclingBGTex = null;

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
        this.recyclingContainer = null;
        this.list = null;

        this.items = [];
        this.recyclingItems = [];

        this.pointerDown = false;
        this.lastPointerY= 0;
        this.listTween = null;

    };

    Inventory.prototype.preload = function(){
    };

    Inventory.prototype.create = function(){

        if(!recyclingBGTex){
            recyclingBGTex = this.add.bitmapData(this.app.width,84);
            recyclingBGTex.fill(0,0,0);
            recyclingBGTex.rect(1,1,this.app.width-1,98,'#2A5E00');
        }

        this.filter = new Phaser.Filter(this.app.game, {timeN: { type: '1f', value: 0 }}, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);
        this.background = this.add.sprite(0,0);
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

        this.items = this.app.user.inventory;

        this.list = this.add.group();
        this.list.x = 0;
        this.list.y = 144;

        this.initItemList();

        this.recyclingContainer = this.add.group();
        var recyclingBG = this.add.sprite(0,0,recyclingBGTex);
        recyclingBG.alpha = 0.8;

        this.recyclingContainer.add(recyclingBG);
        this.recyclingContainer.x = 0;
        this.recyclingContainer.y = 60;

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

    Inventory.prototype.destroy = function(){
        this.background.destroy();
        this.filter.destroy();
        this.titleContainer.destroy();
        this.recyclingContainer.destroy();
    };

    Inventory.prototype.initItemList = function(){
        var y = this.list.y;
        this.list.y = 0;
        this.list.removeAll(true);
        for(var i=0; i<this.items.length; i++){
            var listItem = new InventorylistItem(this.app.game,this,this.items[i]);
            listItem.x = 0;
            listItem.y = i*listItem.height;
            this.list.add(listItem);
        }

        this.list.y = y;

    };

    Inventory.prototype.update = function(){
        if(this.isInputEnabled() && this.input.activePointer.isDown) {
            if (!this.pointerDown) {
                this.lastPointerY = this.input.activePointer.y;
                this.pointerDown = true;
                if(this.listTween != null){
                    this.listTween.stop();
                }
            }

            var move = this.input.activePointer.y - this.lastPointerY;

            this.list.y += move;

            this.lastPointerY = this.input.activePointer.y;

        }

        if(this.input.activePointer.justReleased() || !this.isInputEnabled()) {
            if (this.pointerDown) {
                this.pointerDown = false;

                var isLongerThanView = (this.list.height > (this.app.height - 144));

                if(this.list.y > 144 ||  !isLongerThanView && this.list.y < 144){
                    this.listTween = this.add.tween(this.list).to({y: 144},150);
                    this.listTween.start();
                }

                if(isLongerThanView && (this.list.y + this.list.height) < (this.app.height)){
                    this.listTween = this.add.tween(this.list).to({y: (this.app.height -  this.list.height)},150);
                    this.listTween.start();
                }
            }
        }
    };

    return new Inventory();
});