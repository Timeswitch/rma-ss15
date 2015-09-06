/**
 * Created by michael on 05/09/15.
 */
define([
    'states/BaseState',
    'gameobjects/TileBox',
    'gameobjects/RobotGroup',
    'gameobjects/InventorylistItem',
    'gameobjects/RobotSlotItem'
],function(BaseState,TileBox,RobotGroup,InventorylistItem,RobotSlotItem){

    function RoboConfig(){
        BaseState.call(this);
    }

    var configBG = null;

    RoboConfig.prototype = Object.create(BaseState.prototype);
    RoboConfig.prototype.constructor = RoboConfig;

    RoboConfig.prototype.init = function(){
        BaseState.prototype.init.call(this);

        this.slotHeight = 40;
        this.slotWidth = (this.app.width/2)-4;
        this.configAreaY = 60;
        this.inventoryAreaY = 64 + (5*this.slotHeight);

        this.titleContainer = null;
        this.background = null;
        this.filter = null;

        this.configArea = null;
        this.configRobot = null;
        this.configSlots = null;
        this.attackText = null;
        this.defenseText = null;
        this.agilityText = null;
        this.slotHead = null;
        this.slotBody = null;
        this.slotArms = null;
        this.slotLegs = null;
        this.slotShield = null;
        this.statStyle = {font: "24px vt323regular",fill: '#ffffff',align: 'left'};

        this.inventoryArea = null;
        this.list = null;

        this.items = [];

        this.pointerDown = false;
        this.isHolding = false;
        this.canHold = true;
        this.lastPointerY = 0;
        this.pointerDownPosition = {y: 0};
        this.listTween = null;

    };

    RoboConfig.prototype.create = function(){
        this.filter = new Phaser.Filter(this.app.game, {timeN: { type: '1f', value: 0 }}, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);
        this.background = this.add.sprite(0,0);
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

        this.initItems();

        this.list = this.add.group();
        this.list.x = 0;
        this.list.y = 0;

        this.initItemList();

        this.list.y = this.inventoryAreaY;

        this.configArea = this.add.group();
        this.configArea.x = 0;
        this.configArea.y = 0;

        if(!configBG){
            var height = this.inventoryAreaY - this.configAreaY;
            configBG = this.add.bitmapData(this.app.width,height);
            configBG.fill(0,0,0);
            configBG.rect(2,2,(this.app.width/2),height-4,'#2A5E00');
            configBG.rect((this.app.width/2)+4,2,this.app.width-4,height-4,'#2A5E00');
        }

        this.configArea.create(0,0,configBG);

        var attack = this.add.text(this.app.width/4, 10, 'ANGR: ',this.statStyle);
        var defense = this.add.text(this.app.width/4, attack.y + 36, 'VRT : ',this.statStyle);
        var agility = this.add.text(this.app.width/4, defense.y + 36, 'BWGL: ',this.statStyle);

        this.attackText = this.add.text((this.app.width/4) + attack.width, attack.y, '-',this.statStyle);
        this.defenseText = this.add.text((this.app.width/4) + attack.width, attack.y + 34, '-',this.statStyle);
        this.agilityText = this.add.text((this.app.width/4) + attack.width, defense.y + 34, '-',this.statStyle);

        this.configArea.add(attack);
        this.configArea.add(defense);
        this.configArea.add(agility);

        this.configArea.add(this.attackText);
        this.configArea.add(this.defenseText);
        this.configArea.add(this.agilityText);

        this.updateRobot();

        this.configSlots = this.add.group();
        this.configSlots.x = 0;
        this.configSlots.y = 0;

        this.initSlots();

        this.configSlots.add(this.slotHead);
        this.configSlots.add(this.slotBody);
        this.configSlots.add(this.slotArms);
        this.configSlots.add(this.slotLegs);
        this.configSlots.add(this.slotShield);

        this.configSlots.x = (this.app.width/2)+4;
        this.configSlots.y = 2;

        this.configArea.add(this.configSlots);

        this.configArea.y = this.configAreaY;
        this.titleContainer = new TileBox(this.app.game,this.app.width,60);

        this.titleContainer.x = 0;
        this.titleContainer.y = 0;

        var titleText = this.app.game.add.text(this.world.centerX,30,'Zusammenstellung',{font: "35px bitwise",fill: '#ffffff',align: 'center'});
        titleText.anchor.set(0.5);
        this.titleContainer.add(titleText);
        this.titleContainer.forEach(function(e){
            e.alpha = 0.7;
        },this);

        var menuButton = this.app.game.add.text(10,2,'<',{font: "50px vt323regular",fill: '#ffffff',align: 'center'});
        this.titleContainer.add(menuButton);
        this.createOnClick(menuButton,this.onBack);

    };

    RoboConfig.prototype.update = function(){
        if(this.isInputEnabled() && this.input.activePointer.isDown) {
            if (!this.pointerDown) {
                this.lastPointerY = this.input.activePointer.y;
                this.pointerDownPosition.x = this.input.activePointer.x;
                this.pointerDownPosition.y = this.input.activePointer.y;
                this.pointerDown = true;

                if(this.pointerDownPosition.y > this.inventoryAreaY){
                    if(this.listTween != null){
                        this.listTween.stop();
                    }
                }
            }

            if(this.isInputEnabled()){

                if(this.isHolding) {
                    if (this.dragItem) {
                        this.dragItem.x = this.input.activePointer.x - (this.dragItem.width / 2);
                        this.dragItem.y = this.input.activePointer.y - (this.dragItem.height / 2);
                    } else {
                        this.isHolding = false;
                    }
                }else if(this.pointerDownPosition.y > this.inventoryAreaY){
                    var move = this.input.activePointer.y - this.lastPointerY;

                    this.list.y += move;

                    this.lastPointerY = this.input.activePointer.y;

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

                    if(this.input.activePointer.y > this.inventoryAreaY && this.dragItem.removeItem){
                        this.removeFromConfig(this.dragItem.item);
                    }else if(this.input.activePointer.y > 60 && this.input.activePointer.y < this.inventoryAreaY && !this.dragItem.removeItem){
                        this.addToConfig(this.dragItem.item);
                    }

                    this.dragItem.destroy();
                    this.dragItem = null;
                }

                var isLongerThanView = (this.list.height > (this.app.height - this.inventoryAreaY));

                if(this.list.y > 144 ||  !isLongerThanView && this.list.y < this.inventoryAreaY){
                    this.listTween = this.add.tween(this.list).to({y: this.inventoryAreaY},150);
                    this.listTween.start();
                }

                if(isLongerThanView && (this.list.y + this.list.height) < (this.app.height)){
                    this.listTween = this.add.tween(this.list).to({y: (this.app.height -  this.list.height)},150);
                    this.listTween.start();
                }
            }
        }
    };

    RoboConfig.prototype.updateRobot = function(){
        if(this.configRobot){
            this.configRobot.destroy();
        }

        var height = this.inventoryAreaY - this.configAreaY;
        this.configRobot = this.app.makeRobot('player');
        this.app.scaleMax(this.configRobot,this.app.width/4,height);
        this.configRobot.y = this.configAreaY + ((height/2) - (this.configRobot.height/2));
        this.configRobot.x = 4;
        
        var stats = this.app.user.robot.getStats();
        
        this.attackText.setText(stats.attack || '-');
        this.defenseText.setText(stats.defense || '-');
        this.agilityText.setText(stats.agility || '-');
    };

    RoboConfig.prototype.initItems = function(){
        for(var i=0;i<this.items.length;i++){
            this.items[i].DSRevert();
        }

        this.items = this.app.user.inventory;

        var prioList = ['head','body','arms','legs'];
        this.items.sort(function(a,b){

            var prioA = prioList.indexOf(a.robotpart.slot);
            var prioB = prioList.indexOf(b.robotpart.slot);

            var prio = (prioA < prioB);

            if(prio){
                return -1;
            }else if(prioA == prioB){
                return a.robotpart.name.localeCompare(b.robotpart.name);
            }

            return 1;

        });
    };

    RoboConfig.prototype.initItemList = function(){
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
                c++;
            }
        }

        this.list.y = y;

    };

    RoboConfig.prototype.initSlots = function(){
        var robot = this.app.user.robot;

        if(!this.slotHead){
            this.slotHead = new RobotSlotItem(this.app.game,this,robot.head,'Kopf',this.slotWidth);
            this.slotHead.x = 0;
            this.slotHead.y = 0;
        }else{
            this.slotHead.setItem(robot.head);
        }

        if(!this.slotBody){
            this.slotBody = new RobotSlotItem(this.app.game,this,robot.body,'Torso',this.slotWidth);
            this.slotBody.x = 0;
            this.slotBody.y = this.slotHead.y + this.slotHeight;
        }else{
            this.slotBody.setItem(robot.body);
        }

        if(!this.slotArms){
            this.slotArms = new RobotSlotItem(this.app.game,this,robot.arms,'Arme',this.slotWidth);
            this.slotArms.x = 0;
            this.slotArms.y = this.slotBody.y + this.slotHeight;
        }else{
            this.slotArms.setItem(robot.arms);
        }

        if(!this.slotLegs){
            this.slotLegs = new RobotSlotItem(this.app.game,this,robot.legs,'Beine',this.slotWidth);
            this.slotLegs.x = 0;
            this.slotLegs.y = this.slotArms.y + this.slotHeight;
        }else{
            this.slotLegs.setItem(robot.legs);
        }

        if(!this.slotShield){
            this.slotShield = new RobotSlotItem(this.app.game,this,null,'Schild',this.slotWidth);
            this.slotShield.x = 0;
            this.slotShield.y = this.slotLegs.y + this.slotHeight;
        }else{
            this.slotShield.setItem(null);
        }
    };

    RoboConfig.prototype.addToConfig = function(item){

    };

    RoboConfig.prototype.removeFromConfig = function(item){
        if(item.slot == 'body'){
            this.showDialog('Hinweis','Es muss immer ein Torso\nvorhanden sein!');
            return;
        }
        //this.app.user.addItem(item.id);
        this.app.user.robot[item.slot+'_id'] = null;

        this.updateRobot();
        this.initSlots();
        this.initItemList();
    };

    RoboConfig.prototype.onHold = function(target){
        if(target != null) {

            if(target.sprite.parent.item) {
                this.isHolding = true;
                this.canHold = false;

                var listItem = target.sprite.parent;

                this.dragItem = listItem.getIcon();
                this.dragItem.item = listItem.item;
                this.app.scaleMax(this.dragItem,60,60);
                this.dragItem.x = this.input.activePointer.x;
                this.dragItem.y = this.input.activePointer.y;

                if(listItem.hasOwnProperty('slotType')){
                    this.dragItem.removeItem = true;
                }
            }

        }
    };

    RoboConfig.prototype.onBack = function(){
        this.app.startState('Menu');
    };

    return new RoboConfig();

});