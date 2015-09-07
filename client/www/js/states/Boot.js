'use strict';

define([
    'states/BaseState',
    'states/Menu',
    'states/Fight',
    'states/Inventory',
    'states/Friendlist',
    'states/Connect',
    'states/RoboConfig'

], function(BaseState, Menu, Fight, Inventory, Friendlist, Connect,RoboConfig){

    function Boot(){
        BaseState.call(this);
        this.busy = true;
    }

    Boot.prototype = Object.create(BaseState.prototype);
    Boot.prototype.constructor = Boot;

    Boot.prototype.preload = function(){
        this.app.loadRoboParts();
        this.load.image('alertTL','assets/tiles/alert_tl.png');
        this.load.image('alertT','assets/tiles/alert_t.png');
        this.load.image('alertTR','assets/tiles/alert_tr.png');
        this.load.image('alertL','assets/tiles/alert_l.png');
        this.load.image('alertM','assets/tiles/alert_m.png');
        this.load.image('alertR','assets/tiles/alert_r.png');
        this.load.image('alertBL','assets/tiles/alert_bl.png');
        this.load.image('alertB','assets/tiles/alert_b.png');
        this.load.image('alertBR','assets/tiles/alert_br.png');
        this.load.spritesheet('progressbar','assets/spritesheets/progress__bar.png',120,40);
        this.load.spritesheet('buttonOK','assets/spritesheets/OK.png',84,40);
        this.load.spritesheet('buttonCancel','assets/spritesheets/nein.png',84,40);
        this.load.spritesheet('buttonBattle','assets/spritesheets/battle.png',30,30);
        this.load.spritesheet('buttonDelete','assets/spritesheets/bucket.png',30,30);
    };

    Boot.prototype.init = function(){
        BaseState.prototype.init.call(this);

        console.log(this.app);
        this.app.canvas = document.getElementsByTagName('canvas')[0];
        this.app.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        this.app.game.scale.pageAlignVertically = true;
        this.app.game.scale.pageAlignHorizontally = true;

        if(this.app.game.context != null){
            Phaser.Canvas.setSmoothingEnabled(this.game.context, false);
        }

        Phaser.Canvas.setImageRenderingCrisp(this.app.game.canvas);
        PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
        document.body.style.height = this.app.height + 'px';

        console.log(this);
    };

    Boot.prototype.create = function(){

        var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
        var text = this.add.text(this.world.centerX, this.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);

        text.anchor.set(0.5);

        this.app.game.state.add('Connect', Connect);
        this.app.game.state.add('Menu', Menu);
        this.app.game.state.add('Fight', Fight);
        this.app.game.state.add('Inventory', Inventory);
        this.app.game.state.add('Friendlist', Friendlist);
        this.app.game.state.add('RoboConfig', RoboConfig);


        this.app.game.state.start('Connect');
    };

    return new Boot();
});