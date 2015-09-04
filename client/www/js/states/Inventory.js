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
        this.recyclingButton = null;
        this.list = null;

        this.items = [];
        this.recyclingItems = [];

        this.pointerDown = false;
        this.lastPointerY= 0;
        this.listTween = null;

        this.pointerDownPosition = {x:0, y:0};
        this.canHold = true;
        this.isHolding = false;
        this.dragItem = null;

    };

    Inventory.prototype.preload = function(){
        this.load.image('buttonRecycle','assets/spritesheets/recycle.png');
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

        this.recyclingButton = this.add.button(this.app.width - 82,63,'buttonRecycle',this.onRecycle,this,0,0,1,0);

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

    Inventory.prototype.shutdown = function(){
        this.background.destroy();
        this.filter.destroy();
        this.titleContainer.destroy();
        this.recyclingContainer.destroy();
        this.recyclingButton.destroy();

        this.resetItems();
    };

    Inventory.prototype.initItemList = function(){
        var y = this.list.y;
        this.list.y = 0;
        this.list.removeAll(true);

        for(var i= 0, c = 0; i<this.items.length; i++){
            var item = this.items[i];

            if(item.count > 0){
                var listItem = new InventorylistItem(this.app.game,this,item);
                listItem.x = 0;
                listItem.y = c*listItem.height;
                this.list.add(listItem);
                c++; //he
            }
        }

        this.list.y = y;

    };

    Inventory.prototype.initRecycleList = function(){

    };

    Inventory.prototype.update = function(){
        if(this.isInputEnabled() && this.input.activePointer.isDown) {
            if (!this.pointerDown) {
                this.lastPointerY = this.input.activePointer.y;
                this.pointerDownPosition.x = this.input.activePointer.x;
                this.pointerDownPosition.y = this.input.activePointer.y;
                this.pointerDown = true;
                if(this.listTween != null){
                    this.listTween.stop();
                }
            }

            if(this.isInputEnabled() && this.isHolding){
                this.dragItem.x = this.input.activePointer.x - (this.dragItem.width/2);
                this.dragItem.y = this.input.activePointer.y - (this.dragItem.height/2);
            }else{
                var move = this.input.activePointer.y - this.lastPointerY;

                this.list.y += move;

                this.lastPointerY = this.input.activePointer.y;

                if(this.input.activePointer.duration >= 500 && this.canHold){
                    if(Math.abs(this.pointerDownPosition.x - this.input.activePointer.x) <= 5 && Math.abs(this.pointerDownPosition.y - this.input.activePointer.y) <= 5){
                        this.onHold(this.input.activePointer.targetObject);
                    }else{
                        this.canHold = false;
                    }

                    this.input.activePointer.timeDown = this.app.game.time.time;
                    this.input.activePointer.resetMovement();
                }
            }

        }

        if(this.input.activePointer.justReleased() || !this.isInputEnabled()) {
            if (this.pointerDown) {
                this.pointerDown = false;
                this.canHold = true;

                if(this.isHolding){
                    this.isHolding = false;
                    this.recyclingContainer.tint = 0xffffff;

                    if(this.input.activePointer.y < 144 && this.input.activePointer.y > 60){
                        this.addRecycle(this.dragItem.item);
                    }

                    this.dragItem.destroy();
                    this.dragItem = null;
                }

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

    Inventory.prototype.onHold = function(target){
        if(target != null && target.sprite.parent.item){
            this.isHolding = true;
            this.canHold = false;

            var listItem = target.sprite.parent;

            this.dragItem = listItem.getIcon();
            this.dragItem.item = listItem.item;
            this.dragItem.scale.set(2,2);
            this.dragItem.x = this.input.activePointer.x;
            this.dragItem.y = this.input.activePointer.y;
            this.recyclingContainer.tint = 0xffffbb;
        }
    };

    Inventory.prototype.addRecycle = function(item){
        item.count--;

        var exists = false;
        for(var i = 0; i < this.recyclingItems.length; i++){
            if(this.recyclingItems[i].item.id == item.id){
                this.recyclingItems[i].count++;
                exists = true;
                break;
            }
        }

        if(!exists){
            this.recyclingItems.push({item: item, count: 1});
        }

        this.initItemList();
    };

    Inventory.prototype.onRecycle = function(){
        if(this.recyclingItems.length > 0 && this.isInputEnabled()){
            this.showDialog('Achtung',"Möchtest du diese\nBauteile recyclen?",this.recycle.bind(this),this.resetRecycle.bind(this));
        }
    };

    Inventory.prototype.recycle = function(){
        this.showProgress();
        this.stopProgress();
    };

    Inventory.prototype.resetRecycle = function(){
        this.recyclingItems = [];
        this.resetItems();

        this.initItemList();
        this.initRecycleList();
    };

    Inventory.prototype.resetItems = function(){
        for(var i = 0; i < this.items.length; i++){
            this.items[i].DSRevert();
        }
    };

    return new Inventory();
});