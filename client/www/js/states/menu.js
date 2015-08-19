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

        this.scanIcon = null;

        this.infoText = null;

        this.content = null;
        this.contentTween = null;
    }

    Menu.prototype = Object.create(Phaser.State.prototype);
    Menu.prototype.constructor = Menu;


    Menu.prototype.init = function(){
        this.app = require('app');


        this.contentPage = 0;
        this.contentPageMin = -1;
        this.contentPageMax = 1;
        this.lastPointerX = 0;
        this.pointerDown = false;
    };

    Menu.prototype.preload = function(){
        this.load.image('background', 'assets/mainmenu/background.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('scan_icon', 'assets/mainmenu/scan.png');
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

        this.content = this.game.add.group();

        this.robot = this.app.makeRobot('player');


        this.app.scaleMax(this.robot,this.world.width - 112,this.world.height - 260);
        this.robot.x = this.world.centerX - (this.robot.width/2);
        this.robot.y = this.world.centerY - (this.robot.height/2);
        //this.robot.setAll('tint', 0x76dc51);
        this.robot.alpha = 0.5;
        this.content.add(this.robot);

        this.scanIcon = this.add.sprite(this.world.centerX,this.world.centerY,'scan_icon');
        this.app.scaleMax(this.scanIcon,this.world.width - 180,this.world.height - 260);
        this.scanIcon.x += this.app.width;
        this.scanIcon.anchor.set(0.5);
        this.scanIcon.tint = 0x419001;
        this.scanIcon.alpha = 0.5;

        this.createOnClick(this.scanIcon,function(){
            this.onScanClick();
        });

        this.content.add(this.scanIcon);

        this.infoText = this.add.text(this.world.centerX,this.app.height - 50,'Zusammenstellung',{font: "35px bitwise",fill: '#419001',align: 'center'});
        this.infoText.anchor.set(0.5);




        this.logo = this.add.sprite(this.world.centerX, 80, 'logo');
        this.logo.anchor.set(0.5);



        this.arrowLeft = this.add.button(32, this.world.centerY, 'arrow_left');
        this.arrowLeft.anchor.set(0.5);
        this.arrowRight = this.add.button(this.world.width - 32, this.world.centerY, 'arrow_right');
        this.arrowRight.anchor.set(0.5);

    };

    Menu.prototype.update = function(){
        this.filter.update();

        if(this.input.activePointer.isDown){


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

        if(this.input.activePointer.justReleased()){
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
            case -1:
                this.infoText.text = 'Inventar';
                break;
            case 0:
                this.infoText.text = 'Zusammenstellung';
                break;
            case 1:
                this.infoText.text = 'Scannen';
                break;
        }

        var pos = -(this.game.width * this.contentPage);
        this.contentTween = this.add.tween(this.content).to({x:pos},150);
        this.contentTween.start();
    };

    Menu.prototype.render = function(){
        this.app.game.debug.text(''+this.contentPage, 10, 10);
    };

    Menu.prototype.createOnClick = function(object,handler){
        object.inputEnabled = true;
        object.events.onInputDown.add(function(){
            object.alpha = 0.2;
            object.lastPos = this.input.activePointer.x;
        },this);
        object.events.onInputUp.add(function(){
            object.alpha = 0.5;
            if(Math.abs(this.input.activePointer.x-object.lastPos) <= 5){
                handler.call(this);
            }
        },this);
    };

    Menu.prototype.onScanClick = function(){
        var self = this;
        cordova.plugins.barcodeScanner.scan(function(result){
            if(!result.cancelled){
                var code = btoa(result.text) + ';;' + result.format;
                self.app.connection.sendCode(code,self.onScanResult.bind(self));
            }
        },function(error){
            alert('Ein Fehler ist aufgetreten.');
        });
    };

    Menu.prototype.onScanResult = function(data){
        if(data.valid){
            alert(this.app.store.get('RobotPart',data.item).name);
        }else{
            alert('Du hast diesen Code heute bereits gescant!');
        }
    };



    return new Menu();
});