/**
 * Created by michael on 21/07/15.
 */
'use strict';


define(function(){

    function RobotGroup(game,config,back){
        Phaser.Group.call(this,game);

        this.config = config || {
                head: 0,
                body: 0,
                arms: 0,
                legs: 0
            };

        this.back = back || false;

        this.head = null;
        this.body = null;
        this.armLeft = null;
        this.armRight = null;
        this.legs = null;

        this.init();
        this.render();
    }

    RobotGroup.prototype = Object.create(Phaser.Group.prototype);
    RobotGroup.prototype.constructor = RobotGroup;

    RobotGroup.prototype.init = function(){


        this.head = this.create(24,0);
        this.body = this.create(24,32);
        this.legs = this.create(24,80);
        this.armLeft = this.create(0,32);
        this.armRight = this.create(56,32);

    };

    RobotGroup.prototype.render = function(){
        if(this.back){
            this.head.loadTexture('robo_head_back_'+this.config.head);
            this.body.loadTexture('robo_body_back_'+this.config.body);
            this.armLeft.loadTexture('robo_arm_left_back_'+this.config.arms);
            this.armRight.loadTexture('robo_arm_right_back_'+this.config.arms);
            this.legs.loadTexture('robo_legs_back_'+this.config.legs);
        }else{
            this.head.loadTexture('robo_head_'+this.config.head);
            this.body.loadTexture('robo_body_'+this.config.body);
            this.armLeft.loadTexture('robo_arm_left_'+this.config.arms);
            this.armRight.loadTexture('robo_arm_right_'+this.config.arms);
            this.legs.loadTexture('robo_legs_'+this.config.legs);
        }
    };

    RobotGroup.prototype.setConfig = function(){
        this.config = config;
        this.render();
    };

    RobotGroup.prototype.setBack = function(back){
        this.back = back;
        this.render();
    };

    return RobotGroup;

});