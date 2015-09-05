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
        this.recyclingBG = null;
        this.list = null;

        this.items = [];
        this.recyclingItems = [];

        this.pointerDown = false;
        this.pointerDownY = 0;
        this.lastPointerY= 0;
        this.lastPointerX= 0;
        this.listTween = null;
        this.recycleTween = null;

        this.pointerDownPosition = {x:0, y:0};
        this.canHold = true;
        this.isHolding = false;
        this.dragItem = null;

    };

    Inventory.prototype.preload = function(){
        this.load.spritesheet('buttonRecycle','assets/spritesheets/recycle.png',80,80);
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

        this.recyclingBG = this.add.sprite(0,0,recyclingBGTex);
        this.recyclingBG.x = 0;
        this.recyclingBG.y = 60;
        this.recyclingBG.alpha = 0.8;


        this.recyclingContainer = this.add.group();
        this.recyclingContainer.x = 0;
        this.recyclingContainer.y = 60;

        this.recyclingButton = this.add.button(this.app.width - 82,63,'buttonRecycle',this.onRecycle,this,0,0,1,0);

        this.titleContainer = new TileBox(this.app.game,this.app.width,60);

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
        this.recyclingBG.destroy();

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
        var x = this.recyclingContainer.x;
        this.recyclingContainer.x = 0;
        this.recyclingContainer.y = 0;

        this.recyclingContainer.removeAll(true);

        for(var i = 0; i < this.recyclingItems.length; i++){
            var recyclingItem = this.recyclingItems[i];

            var icon = this.add.group();
            var image = this.add.sprite(0,0,recyclingItem.icon);
            icon.add(image);
            if(recyclingItem.count > 1){
                var counterText = this.add.text(0,0,recyclingItem.count,{font: "18px vt323regular",fill: '#ff0000',align: 'center'});
                counterText.x = -(counterText.width/2);
                counterText.y = -(counterText.height/2);
                icon.add(counterText);
            }

            image.item = recyclingItem;
            image.inputEnabled = true;
            icon.y = 12 ;
            icon.x = 10 + (i*70);

            this.recyclingContainer.add(icon);
        }

        this.recyclingContainer.x = x;
        this.recyclingContainer.y = 60;
    };

    Inventory.prototype.update = function(){
        if(this.isInputEnabled() && this.input.activePointer.isDown) {
            if (!this.pointerDown) {
                this.lastPointerY = this.input.activePointer.y;
                this.lastPointerX = this.input.activePointer.x;
                this.pointerDownY = this.input.activePointer.y;
                this.pointerDownX = this.input.activePointer.x;
                this.pointerDownPosition.x = this.input.activePointer.x;
                this.pointerDownPosition.y = this.input.activePointer.y;
                this.pointerDown = true;

                if(this.pointerDownY > 144){
                    if(this.listTween != null){
                        this.listTween.stop();
                    }
                }else if(this.pointerDownY > 60){
                    if(this.recycleTween != null){
                        this.recycleTween.stop();
                    }
                }
            }

            if(this.isInputEnabled()){

                if(this.isHolding){
                    if(this.dragItem){
                        this.dragItem.x = this.input.activePointer.x - (this.dragItem.width/2);
                        this.dragItem.y = this.input.activePointer.y - (this.dragItem.height/2);
                    }else{
                        this.isHolding = false;
                    }
                }else if(this.pointerDownY > 144){
                    var move = this.input.activePointer.y - this.lastPointerY;

                    this.list.y += move;

                    this.lastPointerY = this.input.activePointer.y;

                }else if(this.pointerDownY > 60){
                    var move = this.input.activePointer.x - this.lastPointerX;

                    this.recyclingContainer.x += move;
                    this.lastPointerX = this.input.activePointer.x;

                }

                if(this.input.activePointer.duration >= 500 && this.canHold){
                    if(Math.abs(this.pointerDownPosition.x - this.input.activePointer.x) <= 5 && Math.abs(this.pointerDownPosition.y - this.input.activePointer.y) <= 5){
                        this.onHold(this.input.activePointer.targetObject);
                    }else{
                        this.canHold = false;
                    }

                    this.input.activePointer.timeDown = this.app.game.time.time;
                }
            }

        }

        if(this.input.activePointer.justReleased() || !this.isInputEnabled()) {
            if (this.pointerDown) {
                this.pointerDown = false;
                this.canHold = true;

                if(this.isHolding){
                    this.isHolding = false;
                    this.recyclingBG.tint = 0xffffff;

                    if(this.input.activePointer.y > 144 && this.dragItem.removeItem){
                        this.removeRecycle(this.dragItem.item);
                    }else if(this.input.activePointer.y > 60 && this.input.activePointer.y < 144 && !this.dragItem.removeItem){
                        this.addRecycle(this.dragItem.listItem.item,this.dragItem);
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

                var isWiderThanView = (this.recyclingContainer.width > (this.app.width - 95));

                if(this.recyclingContainer.x > 0 || (!isWiderThanView && this.recyclingContainer.x < 0)){
                    this.recycleTween = this.add.tween(this.recyclingContainer).to({x: 0},150);
                    this.recycleTween.start();
                }

                if(isWiderThanView && (this.recyclingContainer.width + this.recyclingContainer.x) < (this.app.width - 95)){
                    this.recycleTween = this.add.tween(this.recyclingContainer).to({x: (this.app.width - 95) - this.recyclingContainer.width},150);
                    this.recycleTween.start();
                }
            }
        }
    };

    Inventory.prototype.onHold = function(target){
        if(target != null){
            this.isHolding = true;
            this.canHold = false;

            if(target.sprite.parent.item){
                var listItem = target.sprite.parent;

                this.dragItem = listItem.getIcon();
                this.dragItem.listItem = listItem;
                this.dragItem.scale.set(2,2);
                this.dragItem.x = this.input.activePointer.x;
                this.dragItem.y = this.input.activePointer.y;
                this.recyclingBG.tint = 0xff0000;
            }else if(target.sprite.item){
                var item = target.sprite.item;
                this.dragItem = this.add.sprite(this.input.activePointer.x,this.input.activePointer.y,item.icon);
                this.dragItem.scale.set(2,2);
                this.dragItem.item = item;
                this.dragItem.removeItem = true;
            }


        }
    };

    Inventory.prototype.addRecycle = function(item,icon){
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
            icon.scale.set(1,1);
            this.recyclingItems.push({item: item, count: 1,icon: icon.generateTexture()});
        }

        this.initItemList();
        this.initRecycleList();
    };

    Inventory.prototype.removeRecycle = function(item){
        item.count--;
        if(item.count < 1){
            this.recyclingItems.splice(this.recyclingItems.indexOf(item),1);
        }

        item.item.count++;

        this.initItemList();
        this.initRecycleList();
    };

    Inventory.prototype.onRecycle = function(){
        if(this.recyclingItems.length > 0 && this.isInputEnabled()){
            this.showDialog('Achtung',"Möchtest du diese\nBauteile recyclen?",this.recycle.bind(this),this.resetRecycle.bind(this));
        }
    };

    Inventory.prototype.recycle = function(){
        this.showProgress();

        var recycle = [];

        for(var i = 0; i<this.recyclingItems.length;i++){
            var recyclingItem = this.recyclingItems[i];
            recycle.push({
                item: recyclingItem.item.id,
                count: recyclingItem.count
            });
        }

        this.app.connection.recycle(recycle,this.onRecycleResult.bind(this));
    };

    Inventory.prototype.onRecycleResult = function(data){
        var self = this;
        this.stopProgress(function(){
            self.resetRecycle();
            self.resetItems();
            self.initItemList();
            self.initRecycleList();

            if(data.success){
                self.showDialog('Bauteil erhalten!',data.item.name,function(){

                });
            }else{
                self.showDialog('Fehlschlag','Keine items erhalten.');
            }
        });
    };

    Inventory.prototype.resetRecycle = function(){
        this.recyclingItems = [];
        this.resetItems();

        this.initItemList();
        this.initRecycleList();
    };

    Inventory.prototype.resetItems = function(){
        this.items = this.app.store.getAll('Item');
        for(var i = 0; i < this.items.length; i++){
            this.items[i].DSRevert();
        }

        this.items = this.app.store.getAll('Item');
    };

    return new Inventory();
});