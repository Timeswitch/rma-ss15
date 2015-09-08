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
    'models/Item',
    'models/Friend'

],function(config,Boot,ConnectionController,RobotGroup,RobotPart,Robot,User,Item,Friend){

        function App(){
            this.config = config;
            this.game = null;
            this.connection = null;
            this.canvas = null;
            this.width = window.innerWidth;// * window.devicePixelRatio;
            this.height = window.innerHeight;// * window.devicePixelRatio;
            this.busy = false;
            this.isFighting = false;

            this.store = new JSData.DS();
            this.user = null;

            this.models = {
                RobotPart: RobotPart(this.store),
                User: User(this.store),
                Robot: Robot(this.store),
                Item: Item(this.store),
                Friend: Friend(this.store)
            };

            document.addEventListener("backbutton", this.onBack.bind(this), false);
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

        App.prototype.saveRobot = function(callback){
            this.connection.saveRobot(callback);
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

            this.game.load.image('robo_body_back_7','assets/robotparts/body_back_7.png');
            this.game.load.image('robo_legs_back_7','assets/robotparts/legs_back_7.png');
            this.game.load.image('robo_head_back_7','assets/robotparts/head_back_7.png');
            this.game.load.image('robo_arm_left_back_7','assets/robotparts/arm_left_back_7.png');
            this.game.load.image('robo_arm_right_back_7','assets/robotparts/arm_right_back_7.png');

            //Roboter 8
            this.game.load.image('robo_body_8','assets/robotparts/body_8.png');
            this.game.load.image('robo_legs_8','assets/robotparts/legs_8.png');
            this.game.load.image('robo_head_8','assets/robotparts/head_8.png');
            this.game.load.image('robo_arm_left_8','assets/robotparts/arm_left_8.png');
            this.game.load.image('robo_arm_right_8','assets/robotparts/arm_right_8.png');

            this.game.load.image('robo_body_back_8','assets/robotparts/body_back_8.png');
            this.game.load.image('robo_legs_back_8','assets/robotparts/legs_back_8.png');
            this.game.load.image('robo_head_back_8','assets/robotparts/head_back_8.png');
            this.game.load.image('robo_arm_left_back_8','assets/robotparts/arm_left_back_8.png');
            this.game.load.image('robo_arm_right_back_8','assets/robotparts/arm_right_back_8.png');

            //Roboter 9
            this.game.load.image('robo_body_9','assets/robotparts/body_9.png');
            this.game.load.image('robo_legs_9','assets/robotparts/legs_9.png');
            this.game.load.image('robo_head_9','assets/robotparts/head_9.png');
            this.game.load.image('robo_arm_left_9','assets/robotparts/arm_left_9.png');
            this.game.load.image('robo_arm_right_9','assets/robotparts/arm_right_9.png');

            this.game.load.image('robo_body_back_9','assets/robotparts/body_back_9.png');
            this.game.load.image('robo_legs_back_9','assets/robotparts/legs_back_9.png');
            this.game.load.image('robo_head_back_9','assets/robotparts/head_back_9.png');
            this.game.load.image('robo_arm_left_back_9','assets/robotparts/arm_left_back_9.png');
            this.game.load.image('robo_arm_right_back_9','assets/robotparts/arm_right_back_9.png');

            //Roboter 10
            this.game.load.image('robo_body_10','assets/robotparts/body_10.png');
            this.game.load.image('robo_legs_10','assets/robotparts/legs_10.png');
            this.game.load.image('robo_head_10','assets/robotparts/head_10.png');
            this.game.load.image('robo_arm_left_10','assets/robotparts/arm_left_10.png');
            this.game.load.image('robo_arm_right_10','assets/robotparts/arm_right_10.png');

            this.game.load.image('robo_body_back_10','assets/robotparts/body_back_10.png');
            this.game.load.image('robo_legs_back_10','assets/robotparts/legs_back_10.png');
            this.game.load.image('robo_head_back_10','assets/robotparts/head_back_10.png');
            this.game.load.image('robo_arm_left_back_10','assets/robotparts/arm_left_back_10.png');
            this.game.load.image('robo_arm_right_back_10','assets/robotparts/arm_right_back_10.png');

            //Roboter 11
            this.game.load.image('robo_body_11','assets/robotparts/body_11.png');
            this.game.load.image('robo_legs_11','assets/robotparts/legs_11.png');
            this.game.load.image('robo_head_11','assets/robotparts/head_11.png');
            this.game.load.image('robo_arm_left_11','assets/robotparts/arm_left_11.png');
            this.game.load.image('robo_arm_right_11','assets/robotparts/arm_right_11.png');

            this.game.load.image('robo_body_back_11','assets/robotparts/body_back_11.png');
            this.game.load.image('robo_legs_back_11','assets/robotparts/legs_back_11.png');
            this.game.load.image('robo_head_back_11','assets/robotparts/head_back_11.png');
            this.game.load.image('robo_arm_left_back_11','assets/robotparts/arm_left_back_11.png');
            this.game.load.image('robo_arm_right_back_11','assets/robotparts/arm_right_back_11.png');
            
            //Roboter 12
            this.game.load.image('robo_body_12','assets/robotparts/body_12.png');
            this.game.load.image('robo_legs_12','assets/robotparts/legs_12.png');
            this.game.load.image('robo_head_12','assets/robotparts/head_12.png');
            this.game.load.image('robo_arm_left_12','assets/robotparts/arm_left_12.png');
            this.game.load.image('robo_arm_right_12','assets/robotparts/arm_right_12.png');

            this.game.load.image('robo_body_back_12','assets/robotparts/body_back_12.png');
            this.game.load.image('robo_legs_back_12','assets/robotparts/legs_back_12.png');
            this.game.load.image('robo_head_back_12','assets/robotparts/head_back_12.png');
            this.game.load.image('robo_arm_left_back_12','assets/robotparts/arm_left_back_12.png');
            this.game.load.image('robo_arm_right_back_12','assets/robotparts/arm_right_back_12.png');


            this.game.load.image('item_1','assets/items/item_1.png');
            this.game.load.image('item_2','assets/items/item_2.png');
            this.game.load.image('item_3','assets/items/item_3.png');
            this.game.load.image('item_4','assets/items/item_4.png');
            this.game.load.image('item_5','assets/items/item_5.png');
            this.game.load.image('item_6','assets/items/item_6.png');
            this.game.load.image('item_7','assets/items/item_7.png');
            this.game.load.image('item_8','assets/items/item_8.png');
            this.game.load.image('item_9','assets/items/item_9.png');
            this.game.load.image('item_10','assets/items/item_10.png');
            this.game.load.image('item_11','assets/items/item_11.png');
            this.game.load.image('item_12','assets/items/item_12.png');
            this.game.load.image('item_13','assets/items/item_13.png');
            this.game.load.image('item_14','assets/items/item_14.png');
            this.game.load.image('item_15','assets/items/item_15.png');
        };

        App.prototype.makeRobot = function(config,back){
            if(config === 'player'){
                config = this.user.robot.getConfig();
            }

            var robot = new RobotGroup(this.game,config,back);

            return robot;
        };

        App.prototype.scaleMax = function(object,roomX, roomY, float){
            var scaleX = roomX / object.width;
            var scaleY = roomY / object.height;

            var scale = 1;

            if(scaleX < scaleY){
                scale = scaleX;
            }else{
                scale = scaleY;
            }

            if(!float){
                scale = Math.max(1,Math.floor(scale));
            }

            object.scale.set(scale,scale);
        };

        App.prototype.startState = function(state){
            this.game.state.start(state);
        };

        App.prototype.injectData = function(model,data){
            if(model == 'Item' || model == 'Friend' || model == 'Robot'){
                this.store.ejectAll(model);
            }
            this.store.inject(model,data);
        };

        App.prototype.addItem = function(item){
            var items = this.user.inventory;

            for(var i = 0; i<items.length; i++){
                if(items[i].id == item){
                    items[i].count++;
                    return;
                }
            }

            this.store.inject('Item',{
                id: item,
                robotpart_id: item,
                user_id: this.user.id,
                count: 1
            });
        };

        App.prototype.removeItem = function(item){
            var items = this.user.inventory;

            for(var i = 0; i<items.length; i++){
                if(items[i].id == item){
                    items[i].count--;
                    return;
                }
            }
        };

        App.prototype.getState = function(){
            return this.game.state.getCurrentState();
        };

        App.prototype.startFight = function(info){
            this.game.state.start('Fight',true,false,info,this.connection.socket);
            this.isFighting = true;
        };

        App.prototype.stopFight = function(data){
            var self = this;
            if(this.isFighting){
                this.isFighting = false;
                this.startState('Menu');

                setTimeout(function(){

                    if(data.status == 'won'){
                        self.getState().showDialog('Gewonnen!',(data.prize ? self.store.get('RobotPart',data.prize).name : 'Nichts') + ' erhalten.');
                    }else{
                        self.getState().showDialog('Niederlage!',(data.prize ? self.store.get('RobotPart',data.prize).name : 'Nichts') + ' verloren.');
                    }

                },500);

            }
        };

        App.prototype.requestFight = function(id){
            this.connection.requestFight(id);
        };

        App.prototype.onBack = function(){
            if(this.game && this.game.state.getCurrentState().onBack){
                this.game.state.getCurrentState().onBack();
            }
        };

        return new App();

});


