/**
 * Created by michael on 07/09/15.
 */

var Promise = require('bluebird');

function FightController(app,player1,player2){
    this.app = app;
    this.player1 = player1;
    this.player2 = player2;

    this.readyCount = 0;

    this.activePlayer = player1;
    this.pausedPlayer = player2;
}

FightController.prototype.start = function(){
    return Promise.all([
        this.initPlayer(this.player1,this.player2),
        this.initPlayer(this.player2,this.player1)
    ]);
};

FightController.prototype.stop = function(){
    return Promise.all([
        this.deInitPlayer(this.player1),
        this.deInitPlayer(this.player2)
    ]);
};

FightController.prototype.deInitPlayer = function(player){
    return player.stopFight();
};

FightController.prototype.initPlayer = function(player,enemy) {
    player.fight = this;

    return enemy.user.robot().fetch({require: true}).then(function(robot){
        return player.socket.emit('requestFightResult',{
            status: 'ACCEPT',
            username: enemy.user.get('username'),
            robot: robot.toJSON({shallow: true})
        });
    });
};

FightController.prototype.onPlayerReady = function(){
    this.readyCount++;

    if(this.readyCount >= 2){
        this.activePlayer.emit('fightCommand',{
            command: 'active'
        })
    }
};

FightController.prototype.parseCommand = function(data){
    var player = this.app.getUserConnection(data.who);

    switch(data.command){
        case 'ready':
            this.onPlayerReady();
            break;
        case 'abort':
            this.app.stopFight(player);
            return;
    }

    if(!this.currentPlayer == player || this.readyCount < 2){
        return;
    }

    switch(data.command){
        case 'attack':
            this.attack();
            break;
    }

    var pause = this.currentPlayer;
    this.currentPlayer = this.pausedPlayer;
    this.pausedPlayer = pause;

    this.pausedPlayer.emit('fightCommand',{
        command: 'wait'
    });
};

FightController.prototype.attack = function(){
    this.pausedPlayer.socket.emit('fightCommand',{
        command: 'enemyAttack'
    });
};

module.exports = FightController;