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

        this.enemyName = data.username;
        this.enemyRobotConfig = this.app.store.inject('Robot',data.robot).getConfig();

        this.playerName = this.app.user.username;
        this.playerRobotConfig = this.app.user.robot.getConfig();

        this.playerRobot = null;
        this.enemyRobot = null;
    };

    Fight.prototype.create = function(){
        console.log(this);

        this.enemyRobot = new RobotGroup(this.app.game,this.enemyRobotConfig);

        this.playerRobot = new RobotGroup(this.app.game,this.playerRobotConfig,true);
        this.playerRobot.x += this.enemyRobot.width;
    };

    return new Fight();
});