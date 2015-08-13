/**
 * Created by michael on 23/06/15.
 */
'use strict';

define([
    'states/boot',
    'inc/controllers/ConnectionController',
    'inc/gameobjects/RobotGroup',
    'inc/models/RobotPart',
    'inc/models/Robot',
    'inc/models/User',

],function(Boot,ConnectionController,RobotGroup,RobotPart,Robot,User){

        function App(){
            this.game = null;
            this.connection = null;
            this.canvas = null;
            this.width = window.innerWidth;// * window.devicePixelRatio;
            this.height = window.innerHeight;// * window.devicePixelRatio;

            this.store = new JSData.DS();
            this.user = null;

            this.models = {
                RobotPart: RobotPart(this.store),
                User: User(this.store),
                Robot: Robot(this.store)
            };
        }


        App.prototype.run = function(){

            this.loadUser();
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

        App.prototype.initConnection = function(){
            this.connection = new ConnectionController(this,'http://localhost:2209');
        };

        App.prototype.saveUser = function(id){
            this.user = this.store.get('User',id);
            localStorage.setItem('user',JSON.stringify(this.user));
        };

        App.prototype.loadUser = function(){
            var user = JSON.parse(localStorage.getItem('user'));
            if(user != null){
                this.injectData('User',user);
                this.saveUser(user.id);
            }
        };

        App.prototype.loadRoboParts = function(){
            
            //Roboter 0
            this.game.load.image('robo_body_0','assets/robotparts/body_0.png');
            this.game.load.image('robo_legs_0','assets/robotparts/legs_0.png');
            this.game.load.image('robo_head_0','assets/robotparts/head_0.png');
            this.game.load.image('robo_arm_left_0','assets/robotparts/arm_left_0.png');
            this.game.load.image('robo_arm_right_0','assets/robotparts/arm_right_0.png');

            this.game.load.image('robo_body_back_0','assets/robotparts/body_back_0.png');
            this.game.load.image('robo_legs_back_0','assets/robotparts/legs_back_0.png');
            this.game.load.image('robo_head_back_0','assets/robotparts/head_back_0.png');
            this.game.load.image('robo_arm_left_back_0','assets/robotparts/arm_left_back_0.png');
            this.game.load.image('robo_arm_right_back_0','assets/robotparts/arm_right_back_0.png');

            //Roboter 1
            this.game.load.image('robo_body_1','assets/robotparts/body_1.png');
            this.game.load.image('robo_legs_1','assets/robotparts/legs_1.png');
            this.game.load.image('robo_head_1','assets/robotparts/head_1.png');
            this.game.load.image('robo_arm_left_1','assets/robotparts/arm_left_1.png');
            this.game.load.image('robo_arm_right_1','assets/robotparts/arm_right_1.png');

            this.game.load.image('robo_body_back_1','assets/robotparts/body_back_1.png');
            this.game.load.image('robo_legs_back_1','assets/robotparts/legs_back_1.png');
            this.game.load.image('robo_head_back_1','assets/robotparts/head_back_1.png');
            this.game.load.image('robo_arm_left_back_1','assets/robotparts/arm_left_back_1.png');
            this.game.load.image('robo_arm_right_back_1','assets/robotparts/arm_right_back_1.png');

            //Roboter 2
            this.game.load.image('robo_body_2','assets/robotparts/body_2.png');
            this.game.load.image('robo_legs_2','assets/robotparts/legs_2.png');
            this.game.load.image('robo_head_2','assets/robotparts/head_2.png');
            this.game.load.image('robo_arm_left_2','assets/robotparts/arm_left_2.png');
            this.game.load.image('robo_arm_right_2','assets/robotparts/arm_right_2.png');

            this.game.load.image('robo_body_back_2','assets/robotparts/body_back_2.png');
            this.game.load.image('robo_legs_back_2','assets/robotparts/legs_back_2.png');
            this.game.load.image('robo_head_back_2','assets/robotparts/head_back_2.png');
            this.game.load.image('robo_arm_left_back_2','assets/robotparts/arm_left_back_2.png');
            this.game.load.image('robo_arm_right_back_2','assets/robotparts/arm_right_back_2.png');

            //Roboter 3
            this.game.load.image('robo_body_3','assets/robotparts/body_3.png');
            this.game.load.image('robo_legs_3','assets/robotparts/legs_3.png');
            this.game.load.image('robo_head_3','assets/robotparts/head_3.png');
            this.game.load.image('robo_arm_left_3','assets/robotparts/arm_left_3.png');
            this.game.load.image('robo_arm_right_3','assets/robotparts/arm_right_3.png');

            this.game.load.image('robo_body_back_3','assets/robotparts/body_back_3.png');
            this.game.load.image('robo_legs_back_3','assets/robotparts/legs_back_3.png');
            this.game.load.image('robo_head_back_3','assets/robotparts/head_back_3.png');
            this.game.load.image('robo_arm_left_back_3','assets/robotparts/arm_left_back_3.png');
            this.game.load.image('robo_arm_right_back_3','assets/robotparts/arm_right_back_3.png');

            //Roboter 4
            this.game.load.image('robo_body_4','assets/robotparts/body_4.png');
            this.game.load.image('robo_legs_4','assets/robotparts/legs_4.png');
            this.game.load.image('robo_head_4','assets/robotparts/head_4.png');
            this.game.load.image('robo_arm_left_4','assets/robotparts/arm_left_4.png');
            this.game.load.image('robo_arm_right_4','assets/robotparts/arm_right_4.png');

            this.game.load.image('robo_body_back_4','assets/robotparts/body_back_4.png');
            this.game.load.image('robo_legs_back_4','assets/robotparts/legs_back_4.png');
            this.game.load.image('robo_head_back_4','assets/robotparts/head_back_4.png');
            this.game.load.image('robo_arm_left_back_4','assets/robotparts/arm_left_back_4.png');
            this.game.load.image('robo_arm_right_back_4','assets/robotparts/arm_right_back_4.png');
            
        };

        App.prototype.makeRobot = function(config,back){
            if(config === 'player'){
                config = {
                    head: Math.floor(Math.random() * 5),
                    body: Math.floor(Math.random() * 5),
                    arms: Math.floor(Math.random() * 5),
                    legs: Math.floor(Math.random() * 5)
                };
            }

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

        App.prototype.startState = function(state){
            this.game.state.start(state);
        };

        App.prototype.injectData = function(model,data){
            this.store.inject(model,data);
        };

        return new App();

});


