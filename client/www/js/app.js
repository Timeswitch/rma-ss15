/**
 * Created by michael on 23/06/15.
 */
'use strict';

define([

    'states/boot'

],function(Boot){

        function App(){
            this.game = null;
            this.canvas = null;
            this.width = window.innerWidth;// * window.devicePixelRatio;
            this.height = window.innerHeight;// * window.devicePixelRatio;
        }


        App.prototype.run = function(){
            this.game = new Phaser.Game(this.width,this.height,Phaser.AUTO,'',Boot);

            console.log(this.game);
        };

        App.prototype.scaleToScreen = function(sprite,toWith){
            var ratio;

            if(toWith === true){
                ratio = this.width / sprite.width;
                sprite.width = this.width;
                sprite.height = sprite.height * ratio;
            }else{
                ratio = this.height / sprite.height;
                sprite.height = this.height;
                sprite.width = sprite.width * ratio;
            }
        };

        App.prototype.loadRoboParts = function(){
            this.game.load.image('robo_body_0','assets/robotparts/body_0.png');
            this.game.load.image('robo_legs_0','assets/robotparts/legs_0.png');
            this.game.load.image('robo_head_0','assets/robotparts/head_0.png');
            this.game.load.image('robo_arm_left_0','assets/robotparts/arm_left_0.png');
            this.game.load.image('robo_arm_right_0','assets/robotparts/arm_right_0.png');
        };

        App.prototype.makeRobot = function(config,back){
            var robot = this.game.add.group();

            robot.create(24,0,'robo_head_0');
            robot.create(24,32,'robo_body_0');
            robot.create(24,80,'robo_legs_0');
            robot.create(0,32,'robo_arm_left_0');
            robot.create(56,32,'robo_arm_right_0');

            return robot;
        };

        App.prototype.scaleMax = function(object,roomX, roomY){
            var scaleX = roomX / object.width;
            var scaleY = roomY / object.height;

            var scale = 1;

            if(scaleX < scaleY){
                scale = Math.floor(scaleX);
            }else{
                scale = Math.floor(scaleY);
            }

            object.scale.set(scale,scale);
        };

        return new App();

});


