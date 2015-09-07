/**
 * Created by janimo on 09.07.2015.
 */
'use strict';

define([
  'states/BaseState'
],function(BaseState){

    function Menu(){
        BaseState.call(this);

        this.filter = null;


        this.background = null;
        this.logo = null;
        this.arrowLeft = null;
        this.arrowRight = null;

        this.robot = null;

        this.scanIcon = null;

        this.infoText = null;

        this.content = null;
        this.contentTween = null;

        this.inventoryIcon = null;
        this.friendsIcon = null;
        this.battleIcon = null;
        this.seconds = 0;
    }

    Menu.prototype = Object.create(BaseState.prototype);
    Menu.prototype.constructor = Menu;


    Menu.prototype.init = function(){
        BaseState.prototype.init.call(this);


        this.contentPage = 0;
        this.contentPageMin = -2;
        this.contentPageMax = 2;
        this.lastPointerX = 0;
        this.pointerDown = false;
        this.robot = null;
    };

    Menu.prototype.preload = function(){
        this.load.image('background', 'assets/mainmenu/background.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('scan_icon', 'assets/mainmenu/scan.png');
        this.load.spritesheet('arrow_left', 'assets/mainmenu/left.png',32,120);
        this.load.spritesheet('arrow_right', 'assets/mainmenu/right.png',32,120);

        this.load.image('inventory_icon', 'assets/mainmenu/inventory.png');
        this.load.image('friends_icon', 'assets/mainmenu/friends.png');
        this.load.image('battle_icon', 'assets/mainmenu/battle.png');

    };

    Menu.prototype.create = function(){
        this.filter = new Phaser.Filter(this.app.game, {timeN: { type: '1f', value: 0 }}, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);

        this.background = this.add.sprite();//0,0,'background');
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

        this.content = this.game.add.group();

        this.initRobot();

        this.scanIcon = this.add.sprite(this.world.centerX,this.world.centerY,'scan_icon');
        this.app.scaleMax(this.scanIcon,this.world.width - 180,this.world.height - 260);
        this.scanIcon.x -= this.app.width * 2;
        this.scanIcon.anchor.set(0.5);
        this.scanIcon.tint = 0x419001;
        this.scanIcon.alpha = 0.5;

        this.createOnClick(this.scanIcon,function(){
            this.onScanClick();
        });

        this.inventoryIcon = this.add.sprite(this.world.centerX, this.world.centerY, 'inventory_icon');
        this.app.scaleMax(this.inventoryIcon, this.world.width - 180, this.world.height - 260);
        this.inventoryIcon.x -= this.app.width;
        this.inventoryIcon.anchor.set(0.5);
        this.inventoryIcon.alpha = 0.5;

        this.createOnClick(this.inventoryIcon, function(){
            this.onInventoryClick();
        });

        this.friendsIcon = this.add.sprite(this.world.centerX, this.world.centerY, 'friends_icon');
        this.app.scaleMax(this.friendsIcon, this.world.width - 180, this.world.height - 260);
        this.friendsIcon.x += this.app.width * 2;
        this.friendsIcon.anchor.set(0.5);
        this.friendsIcon.alpha = 0.5;

        this.createOnClick(this.friendsIcon, function(){
            this.onFriendsClick();
        });

        this.battleIcon = this.add.sprite(this.world.centerX, this.world.centerY, 'battle_icon');
        this.app.scaleMax(this.friendsIcon, this.world.width - 180, this.world.height - 260);
        this.battleIcon.x += this.app.width;
        this.battleIcon.anchor.set(0.5);
        this.battleIcon.alpha = 0.5;

        this.createOnClick(this.battleIcon, function(){
            this.onBattleClick();
        });

        this.content.add(this.scanIcon);
        this.content.add(this.inventoryIcon);
        this.content.add(this.friendsIcon);
        this.content.add(this.battleIcon);

        this.infoText = this.add.text(this.world.centerX,this.app.height - 50,'Zusammenstellung',{font: "35px bitwise",fill: '#419001',align: 'center'});
        this.infoText.anchor.set(0.5);




        this.logo = this.add.sprite(this.world.centerX, 80, 'logo');
        this.logo.anchor.set(0.5);



        this.arrowLeft = this.add.button(32, this.world.centerY, 'arrow_left');
        this.arrowLeft.anchor.set(0.5);
        this.arrowRight = this.add.button(this.world.width - 32, this.world.centerY, 'arrow_right');
        this.arrowRight.anchor.set(0.5);

    };

    Menu.prototype.initRobot = function(){
        var rob = this.app.makeRobot('player');
        var newRobot = rob.toSprite();
        this.app.scaleMax(newRobot,this.world.width - 112,this.world.height - 260);

        if(this.robot){
            this.content.remove(this.robot);
            newRobot.x = this.robot.x;
            newRobot.y = this.robot.y;
        }else{
            newRobot.x = this.world.centerX - (newRobot.width/2);
            newRobot.y = this.world.centerY - (newRobot.height/2);
        }

        this.robot = newRobot;
        this.robot.alpha = 0.5;

        this.content.add(this.robot);

        this.createOnClick(this.robot,this.onConfigClick);

        rob.destroy();
    };

    Menu.prototype.update = function(){
        //Fix für FP16 Smartphones

        this.updateFP16Filter(this.filter);

        this.filter.update();

        if(this.input.activePointer.isDown && this.isInputEnabled()){


            if(!this.pointerDown){
                this.lastPointerX = this.input.activePointer.x;
                this.pointerDown = true;
                if(this.contentTween != null){
                    this.contentTween.stop();
                }
            }

            var move = this.input.activePointer.x - this.lastPointerX;

            this.content.x += move;

            this.lastPointerX = this.input.activePointer.x;
        }

        if(this.input.activePointer.justReleased() || !this.isInputEnabled()){
            if(this.pointerDown){
                this.pointerDown = false;

                var pos = -(this.game.width * this.contentPage);
                var delta = this.content.x - pos;

                if(delta > this.app.width/8 && this.contentPage > this.contentPageMin){
                    this.contentPage--;
                }else if(delta < -(this.app.width/8) && this.contentPage < this.contentPageMax){
                    this.contentPage++;
                }

                this.bouncePage();

            }
        }

    };

    Menu.prototype.bouncePage =function(){
        switch(this.contentPage){
            case -2:
                this.infoText.text = 'Scannen';
                break;
            case -1:
                this.infoText.text = 'Inventar';
                break;
            case 0:
                this.infoText.text = 'Zusammenstellung';
                break;
            case 1:
                this.infoText.text = 'Battle';
                break;
            case 2:
                this.infoText.text = 'Freunde';
                break;
        }

        var pos = -(this.game.width * this.contentPage);
        this.contentTween = this.add.tween(this.content).to({x:pos},150);
        this.contentTween.start();
    };

    Menu.prototype.shutdown = function(){
        this.background.destroy();
        this.logo.destroy();
        this.arrowLeft.destroy();
        this.arrowRight.destroy();
        this.robot.destroy();
        this.scanIcon.destroy();
        this.infoText.destroy();
        this.inventoryIcon.destroy();
        this.friendsIcon.destroy();
        this.battleIcon.destroy();
    };

    Menu.prototype.onScanClick = function(){
        var self = this;
        cordova.plugins.barcodeScanner.scan(function(result){
            if(!result.cancelled){
                self.showProgress();
                var code = btoa(result.text) + ';;' + result.format;
                self.app.connection.sendCode(code,self.onScanResult.bind(self));
            }
        },function(error){
            self.showDialog('Info','Du benötigst eine Kamera um Codes zu scannen.');
        });
    };

    Menu.prototype.onScanResult = function(data){
        var self = this;
        var data = data;
        this.stopProgress(function(){
            switch(data.status){
                case 'valid':
                    self.showDialog('Bauteil gefunden!',self.app.store.get('RobotPart',data.item).name);
                    break;
                case 'used':
                    self.showDialog('Info','Du hast diesen Code heute bereits gescant!');
                    break;
                case 'empty':
                    self.showDialog('Info','Dieser Code war leider leer.');
                    break;
                default :
                    self.showDialog('Info','Der Code konnte nicht gelesen werden');
                    break;
            }
        });
    };

    Menu.prototype.onInventoryClick = function(){
        this.app.startState('Inventory');
    };

    Menu.prototype.onFriendsClick = function(){
        this.app.startState('Friendlist');
    };

    Menu.prototype.onBattleClick = function(){
        this.showDialog('Debug','battle');
    };

    Menu.prototype.onConfigClick = function(){
        this.app.startState('RoboConfig');
    };

    Menu.prototype.onDataUpdate = function(){
        this.initRobot();
    };


    return new Menu();
});