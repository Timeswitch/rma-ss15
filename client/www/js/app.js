/**
 * Created by michael on 23/06/15.
 */
'use strict';

define([
    'config',
    'states/Boot',
    'controllers/ConnectionController',
    'gameobjects/RobotGroup',
    'models/RobotPart',
    'models/Robot',
    'models/User',
    "models/Item"

],function(config,Boot,ConnectionController,RobotGroup,RobotPart,Robot,User,Item){

        function App(){
            this.config = config;
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
                Robot: Robot(this.store),
                Item: Item(this.store)
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
            var url = (this.config.ssl ? 'https://' : 'http://') + this.config.server + ':' + this.config.port;
            this.connection = new ConnectionController(this,url);
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

            //Roboter 5
            this.game.load.image('robo_body_5','assets/robotparts/body_5.png');
            this.game.load.image('robo_legs_5','assets/robotparts/legs_5.png');
            this.game.load.image('robo_head_5','assets/robotparts/head_5.png');
            this.game.load.image('robo_arm_left_5','assets/robotparts/arm_left_5.png');
            this.game.load.image('robo_arm_right_5','assets/robotparts/arm_right_5.png');

            this.game.load.image('robo_body_back_5','assets/robotparts/body_back_5.png');
            this.game.load.image('robo_legs_back_5','assets/robotparts/legs_back_5.png');
            this.game.load.image('robo_head_back_5','assets/robotparts/head_back_5.png');
            this.game.load.image('robo_arm_left_back_5','assets/robotparts/arm_left_back_5.png');
            this.game.load.image('robo_arm_right_back_5','assets/robotparts/arm_right_back_5.png');

            //Roboter 6
            this.game.load.image('robo_body_6','assets/robotparts/body_6.png');
            this.game.load.image('robo_legs_6','assets/robotparts/legs_6.png');
            this.game.load.image('robo_head_6','assets/robotparts/head_6.png');
            this.game.load.image('robo_arm_left_6','assets/robotparts/arm_left_6.png');
            this.game.load.image('robo_arm_right_6','assets/robotparts/arm_right_6.png');

            this.game.load.image('robo_body_back_6','assets/robotparts/body_back_6.png');
            this.game.load.image('robo_legs_back_6','assets/robotparts/legs_back_6.png');
            this.game.load.image('robo_head_back_6','assets/robotparts/head_back_6.png');
            this.game.load.image('robo_arm_left_back_6','assets/robotparts/arm_left_back_6.png');
            this.game.load.image('robo_arm_right_back_6','assets/robotparts/arm_right_back_6.png');

            //Roboter 7
            this.game.load.image('robo_body_7','assets/robotparts/body_7.png');
            this.game.load.image('robo_legs_7','assets/robotparts/legs_7.png');
            this.game.load.image('robo_head_7','assets/robotparts/head_7.png');
            this.game.load.image('robo_arm_left_7','assets/robotparts/arm_left_7.png');
            this.game.load.image('robo_arm_right_7','assets/robotparts/arm_right_7.png');

            /*this.game.load.image('robo_body_back_7','assets/robotparts/body_back_7.png');
            this.game.load.image('robo_legs_back_7','assets/robotparts/legs_back_7.png');
            this.game.load.image('robo_head_back_7','assets/robotparts/head_back_7.png');
            this.game.load.image('robo_arm_left_back_7','assets/robotparts/arm_left_back_7.png');
            this.game.load.image('robo_arm_right_back_7','assets/robotparts/arm_right_back_7.png');*/

            //Roboter 8
            this.game.load.image('robo_body_8','assets/robotparts/body_8.png');
            this.game.load.image('robo_legs_8','assets/robotparts/legs_8.png');
            this.game.load.image('robo_head_8','assets/robotparts/head_8.png');
            this.game.load.image('robo_arm_left_8','assets/robotparts/arm_left_8.png');
            this.game.load.image('robo_arm_right_8','assets/robotparts/arm_right_8.png');

            /*this.game.load.image('robo_body_back_8','assets/robotparts/body_back_8.png');
            this.game.load.image('robo_legs_back_8','assets/robotparts/legs_back_8.png');
            this.game.load.image('robo_head_back_8','assets/robotparts/head_back_8.png');
            this.game.load.image('robo_arm_left_back_8','assets/robotparts/arm_left_back_8.png');
            this.game.load.image('robo_arm_right_back_8','assets/robotparts/arm_right_back_8.png');*/

            //Roboter 9
            this.game.load.image('robo_body_9','assets/robotparts/body_9.png');
            this.game.load.image('robo_legs_9','assets/robotparts/legs_9.png');
            this.game.load.image('robo_head_9','assets/robotparts/head_9.png');
            this.game.load.image('robo_arm_left_9','assets/robotparts/arm_left_9.png');
            this.game.load.image('robo_arm_right_9','assets/robotparts/arm_right_9.png');

            /*this.game.load.image('robo_body_back_9','assets/robotparts/body_back_9.png');
            this.game.load.image('robo_legs_back_9','assets/robotparts/legs_back_9.png');
            this.game.load.image('robo_head_back_9','assets/robotparts/head_back_9.png');
            this.game.load.image('robo_arm_left_back_9','assets/robotparts/arm_left_back_9.png');
            this.game.load.image('robo_arm_right_back_9','assets/robotparts/arm_right_back_9.png');*/

            //Roboter 10
            this.game.load.image('robo_body_10','assets/robotparts/body_10.png');
            this.game.load.image('robo_legs_10','assets/robotparts/legs_10.png');
            this.game.load.image('robo_head_10','assets/robotparts/head_10.png');
            this.game.load.image('robo_arm_left_10','assets/robotparts/arm_left_10.png');
            this.game.load.image('robo_arm_right_10','assets/robotparts/arm_right_10.png');

            /*this.game.load.image('robo_body_back_10','assets/robotparts/body_back_10.png');
            this.game.load.image('robo_legs_back_10','assets/robotparts/legs_back_10.png');
            this.game.load.image('robo_head_back_10','assets/robotparts/head_back_10.png');
            this.game.load.image('robo_arm_left_back_10','assets/robotparts/arm_left_back_10.png');
            this.game.load.image('robo_arm_right_back_10','assets/robotparts/arm_right_back_10.png');*/

            //Roboter 11
            this.game.load.image('robo_body_11','assets/robotparts/body_11.png');
            this.game.load.image('robo_legs_11','assets/robotparts/legs_11.png');
            this.game.load.image('robo_head_11','assets/robotparts/head_11.png');
            this.game.load.image('robo_arm_left_11','assets/robotparts/arm_left_11.png');
            this.game.load.image('robo_arm_right_11','assets/robotparts/arm_right_11.png');

            /*this.game.load.image('robo_body_back_11','assets/robotparts/body_back_11.png');
            this.game.load.image('robo_legs_back_11','assets/robotparts/legs_back_11.png');
            this.game.load.image('robo_head_back_11','assets/robotparts/head_back_11.png');
            this.game.load.image('robo_arm_left_back_11','assets/robotparts/arm_left_back_11.png');
            this.game.load.image('robo_arm_right_back_11','assets/robotparts/arm_right_back_11.png');*/
            
        };

        App.prototype.makeRobot = function(config,back){
            if(config === 'player'){
                config = this.user.robot.getConfig();
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

            scale = Math.max(1,scale);

            object.scale.set(scale,scale);
        };

        App.prototype.startState = function(state){
            this.game.state.start(state);
        };

        App.prototype.injectData = function(model,data){
            if(model == 'Item'){
                this.store.ejectAll(model);
            }
            this.store.inject(model,data);
        };

        return new App();

});


