/**
 * Created by michael on 23/06/15.
 */
'use strict';

define([

    'states/boot',
    'inc/RobotGroup'

],function(Boot,RobotGroup){

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
            
            //Roboter 0
            this.game.load.image('robo_body_0','assets/robotparts/body_0.png');
            this.game.load.image('robo_legs_0','assets/robotparts/legs_0.png');
            this.game.load.image('robo_head_0','assets/robotparts/head_0.png');
            this.game.load.image('robo_arm_left_0','assets/robotparts/arm_left_0.png');
            this.game.load.image('robo_arm_right_0','assets/robotparts/arm_right_0.png');

            this.game.load.image('robo_body_0_back','assets/robotparts/body_0_back.png');
            this.game.load.image('robo_legs_0_back','assets/robotparts/legs_0_back.png');
            this.game.load.image('robo_head_0_back','assets/robotparts/head_0_back.png');
            this.game.load.image('robo_arm_left_0_back','assets/robotparts/arm_left_0_back.png');
            this.game.load.image('robo_arm_right_0_back','assets/robotparts/arm_right_0_back.png');

            //Roboter 1
            this.game.load.image('robo_body_1','assets/robotparts/body_1.png');
            this.game.load.image('robo_legs_1','assets/robotparts/legs_1.png');
            this.game.load.image('robo_head_1','assets/robotparts/head_1.png');
            this.game.load.image('robo_arm_left_1','assets/robotparts/arm_left_1.png');
            this.game.load.image('robo_arm_right_1','assets/robotparts/arm_right_1.png');

            this.game.load.image('robo_body_1_back','assets/robotparts/body_1_back.png');
            this.game.load.image('robo_legs_1_back','assets/robotparts/legs_1_back.png');
            this.game.load.image('robo_head_1_back','assets/robotparts/head_1_back.png');
            this.game.load.image('robo_arm_left_1_back','assets/robotparts/arm_left_1_back.png');
            this.game.load.image('robo_arm_right_1_back','assets/robotparts/arm_right_1_back.png');

            //Roboter 2
            this.game.load.image('robo_body_2','assets/robotparts/body_2.png');
            this.game.load.image('robo_legs_2','assets/robotparts/legs_2.png');
            this.game.load.image('robo_head_2','assets/robotparts/head_2.png');
            this.game.load.image('robo_arm_left_2','assets/robotparts/arm_left_2.png');
            this.game.load.image('robo_arm_right_2','assets/robotparts/arm_right_2.png');

            this.game.load.image('robo_body_2_back','assets/robotparts/body_2_back.png');
            this.game.load.image('robo_legs_2_back','assets/robotparts/legs_2_back.png');
            this.game.load.image('robo_head_2_back','assets/robotparts/head_2_back.png');
            this.game.load.image('robo_arm_left_2_back','assets/robotparts/arm_left_2_back.png');
            this.game.load.image('robo_arm_right_2_back','assets/robotparts/arm_right_2_back.png');

            //Roboter 3
            this.game.load.image('robo_body_3','assets/robotparts/body_3.png');
            this.game.load.image('robo_legs_3','assets/robotparts/legs_3.png');
            this.game.load.image('robo_head_3','assets/robotparts/head_3.png');
            this.game.load.image('robo_arm_left_3','assets/robotparts/arm_left_3.png');
            this.game.load.image('robo_arm_right_3','assets/robotparts/arm_right_3.png');

            this.game.load.image('robo_body_3_back','assets/robotparts/body_3_back.png');
            this.game.load.image('robo_legs_3_back','assets/robotparts/legs_3_back.png');
            this.game.load.image('robo_head_3_back','assets/robotparts/head_3_back.png');
            this.game.load.image('robo_arm_left_3_back','assets/robotparts/arm_left_3_back.png');
            this.game.load.image('robo_arm_right_3_back','assets/robotparts/arm_right_3_back.png');

            //Roboter 4
            this.game.load.image('robo_body_4','assets/robotparts/body_4.png');
            this.game.load.image('robo_legs_4','assets/robotparts/legs_4.png');
            this.game.load.image('robo_head_4','assets/robotparts/head_4.png');
            this.game.load.image('robo_arm_left_4','assets/robotparts/arm_left_4.png');
            this.game.load.image('robo_arm_right_4','assets/robotparts/arm_right_4.png');

            this.game.load.image('robo_body_4_back','assets/robotparts/body_4_back.png');
            this.game.load.image('robo_legs_4_back','assets/robotparts/legs_4_back.png');
            this.game.load.image('robo_head_4_back','assets/robotparts/head_4_back.png');
            this.game.load.image('robo_arm_left_4_back','assets/robotparts/arm_left_4_back.png');
            this.game.load.image('robo_arm_right_4_back','assets/robotparts/arm_right_4_back.png');
            
        };

        App.prototype.makeRobot = function(config,back){
            var robot = new RobotGroup(this.game,config,back);

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


