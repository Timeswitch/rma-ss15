/**
 * Created by janimo on 09.07.2015.
 */
'use strict';

define(function(){

    function Menu(){
        this.app = null;
        this.filter = null;
        this.filterSrc = [

            "precision mediump float;",

            "uniform float     time;",
            "uniform vec2      resolution;",

            "void main( void ) {",

            "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
            "float pos = (gl_FragCoord.y / resolution.y);",

            "float c = sin(pos * 400.0) * 0.4 + 0.4;",
            "c = pow(c, 0.2);",
            "c *= 0.2;",

            "float band_pos = fract(time * 0.1) * 3.0 - 1.0;",
            "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",

            "gl_FragColor = vec4( 0.0, c, 0.0, 1.0 );",
            "}"
        ];


        this.background = null;
        this.logo = null;
        this.arrowLeft = null;
        this.arrowRight = null;

        this.robot = null;

        this.content = null;
        this.contentPage = 0;
        this.lastPointerX = 0;
        this.pointerDown = false;
    }

    Menu.prototype = new Phaser.State();

    Menu.prototype.init = function(){
        this.app = require('app');
    };

    Menu.prototype.preload = function(){
        this.load.image('background', 'assets/mainmenu/background.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.spritesheet('arrow_left', 'assets/mainmenu/left.png',32,120);
        this.load.spritesheet('arrow_right', 'assets/mainmenu/right.png',32,120);

    };

    Menu.prototype.create = function(){
        this.filter = new Phaser.Filter(this.app.game, null, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);

        this.background = this.add.sprite();//0,0,'background');
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

        this.logo = this.add.sprite(this.world.centerX, 80, 'logo');
        this.logo.anchor.set(0.5);

        this.arrowLeft = this.add.button(32, this.world.centerY, 'arrow_left');
        this.arrowLeft.anchor.set(0.5);
        this.arrowRight = this.add.button(this.world.width - 32, this.world.centerY, 'arrow_right');
        this.arrowRight.anchor.set(0.5);

        this.robot = this.app.makeRobot();

        this.app.scaleMax(this.robot,this.world.width - 112,this.world.height - 260);

        this.robot.x = this.world.centerX - (this.robot.width/2);
        this.robot.y = this.world.centerY - (this.robot.height/2);

        var textRobot = this.add.text(this.world.centerX,this.app.height - 50,'Ausrüstung',{font: "40px bitwise",fill: '#419001',align: 'center'});
        textRobot.anchor.set(0.5);

        this.content = this.game.add.group();
        this.content.add(this.robot);
        this.content.add(textRobot);

    };

    Menu.prototype.update = function(){
        this.filter.update();

        if(this.input.activePointer.justPressed()){
            this.lastPointerX = this.input.activePointer.x;
            this.pointerDown = true;
        }

        if(this.input.activePointer.isDown){
            var move = this.input.activePointer.x - this.lastPointerX;

            this.content.x += move;
            this.lastPointerX = this.input.activePointer.x;
        }

        if(this.input.activePointer.justReleased()){
            if(this.pointerDown){
                this.pointerDown = false;
                if(this.input.activePointer.x > this.app.width / 3 * 2 ){
                    this.contentPage--;
                }else if(this.input.activePointer.x < this.app.width /3){
                    this.contentPage++;
                }
                this.content.x = -(this.game.width * this.contentPage);
            }
        }

    };

    Menu.prototype.render = function(){
        this.app.game.debug.text(''+this.contentPage, 10, 10);
    };



    return new Menu();
});