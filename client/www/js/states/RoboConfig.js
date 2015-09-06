/**
 * Created by michael on 05/09/15.
 */
define([
    'states/BaseState',
    'gameobjects/TileBox',
    'gameobjects/RobotGroup'
],function(BaseState,TileBox){

    function RoboConfig(){
        BaseState.call(this);
    }

    var configBG = null;

    RoboConfig.prototype = Object.create(BaseState.prototype);
    RoboConfig.prototype.constructor = RoboConfig;

    RoboConfig.prototype.init = function(){
        BaseState.prototype.init.call(this);

        this.slotHeight = 40;
        this.slotWidth = (this.app.width/2)-8;
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
        this.statStyle = {font: "24px vt323regular",fill: '#ffffff',align: 'left'};

        this.inventoryArea = null;
    };

    RoboConfig.prototype.create = function(){
        this.filter = new Phaser.Filter(this.app.game, {timeN: { type: '1f', value: 0 }}, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);
        this.background = this.add.sprite(0,0);
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

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
        this.createOnClick(menuButton,function(){
            this.app.startState('Menu');
        });

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

        this.configArea.y = this.configAreaY;

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

    return new RoboConfig();

});