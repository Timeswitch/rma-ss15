define([
    'states/BaseState',
    'gameobjects/RobotGroup'
],function(BaseState,RobotGroup) {
    'use strict';

    function Fight() {
        BaseState.call(this);
        this.busy = true;
    }

    Fight.prototype = Object.create(BaseState.prototype);
    Fight.prototype.constructor = Fight;

    Fight.prototype.init = function(data){
        BaseState.prototype.init.call(this);

        this.filterSrc = [

            "precision mediump float;",

            "uniform float     timeN;",
            "uniform vec2      resolution;",
            "uniform sampler2D iChannel0;",

            "void main( void ) {",

            "float t = timeN;",

            "vec2 uv = gl_FragCoord.xy / resolution.xy;",
            "vec2 texcoord = gl_FragCoord.xy / vec2(resolution.y);",

            "texcoord.y -= t*0.2;",

            "float zz = 1.0/(2.0-uv.y*1.65);",
            "texcoord.y -= zz * sign(zz);",

            "vec2 maa = texcoord.xy * vec2(zz, 1.0) - vec2(zz, 0.0) ;",
            "vec2 maa2 = (texcoord.xy * vec2(zz, 1.0) - vec2(zz, 0.0))*0.3 ;",
            "vec4 stone = texture2D(iChannel0, maa);",
            "vec4 blips = texture2D(iChannel0, maa);",
            "vec4 mixer = texture2D(iChannel0, maa2);",

            "float shade = abs(1.0/zz);",

            "vec3 outp = mix(shade*stone.rgb, mix(1.0, shade, abs(sin(t+maa.y-sin(maa.x))))*blips.rgb, min(1.0, pow(mixer.g*2.1, 2.0)));",
            "gl_FragColor = vec4(outp,1.0);",

            "}"
        ];

        this.filter = null;

        this.enemyName = data.username;
        this.enemyRobotConfig = this.app.store.inject('Robot',data.robot).getConfig();

        this.playerName = this.app.user.username;
        this.playerRobotConfig = this.app.user.robot.getConfig();

        this.background = null;

        this.playerRobot = null;
        this.enemyRobot = null;

        this.buttonAttack = null;
        this.buttonDefend = null;
        this.buttonItem = null;
        this.buttonAbort = null;
        this.buttonGroup = null;
    };

    Fight.prototype.preload = function(){
        this.load.spritesheet('buttonAttack','assets/spritesheets/angreifen.png',84,40);
        this.load.spritesheet('buttonDefend','assets/spritesheets/verteidigen.png',84,40);
        this.load.spritesheet('buttonAbort','assets/spritesheets/fluechten.png',84,40);
        this.load.spritesheet('buttonItem','assets/spritesheets/Item.png',84,40);
        this.load.image('circuitBoard','assets/tiles/platine.png');

    };

    Fight.prototype.create = function(){

        this.background = this.add.sprite(0,0,'circuitBoard');

        this.enemyRobot = new RobotGroup(this.app.game,this.enemyRobotConfig);
        this.app.scaleMax(this.enemyRobot,this.app.width/3,this.app.height,true);

        this.playerRobot = new RobotGroup(this.app.game,this.playerRobotConfig,true);
        this.app.scaleMax(this.playerRobot,this.app.width/1.3,this.app.height,true);

        var scale = (this.app.width/2) / 84;
        this.buttonAttack = this.add.button(0,0,'buttonAttack',null,null,0,0,1,0);
        this.buttonAttack.scale.set(scale,scale);

        this.buttonDefend = this.add.button(this.buttonAttack.width,0,'buttonDefend',null,null,0,0,1,0);
        this.buttonDefend.scale.set(scale,scale);

        this.buttonItem = this.add.button(0,this.buttonAttack.height,'buttonItem',null,null,0,0,1,0);
        this.buttonItem.scale.set(scale,scale);

        this.buttonAbort = this.add.button(this.buttonItem.width,this.buttonItem.y,'buttonAbort',null,null,0,0,1,0);
        this.buttonAbort.scale.set(scale,scale);

        this.buttonGroup = this.add.group();

        this.buttonGroup.add(this.buttonAttack);
        this.buttonGroup.add(this.buttonDefend);
        this.buttonGroup.add(this.buttonItem);
        this.buttonGroup.add(this.buttonAbort);

        this.buttonGroup.y = this.app.height - this.buttonGroup.height;

        this.background.width = this.app.width;
        this.background.height = this.buttonGroup.y;

        var customUniforms = {
            iChannel0: { type: 'sampler2D', value: this.background.texture, textureData: { repeat: true } },
            timeN: { type: '1f', value: 0 }
        };

        this.filter = new Phaser.Filter(this.app.game, customUniforms, this.filterSrc);
        this.filter.setResolution(this.background.width,this.background.height);

        this.background.filters = [this.filter];

        this.playerRobot.x = -(this.playerRobot.width/5);
        this.playerRobot.y = this.buttonGroup.y - (this.playerRobot.height/2);

        this.enemyRobot.x = this.app.width - this.enemyRobot.width;

    };

    Fight.prototype.update = function(){
        this.updateFP16Filter(this.filter);
        this.filter.update();
    };

    return new Fight();
});