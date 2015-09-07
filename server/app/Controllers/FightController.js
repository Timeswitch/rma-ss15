/**
 * Created by michael on 07/09/15.
 */

var Promise = require('bluebird');

function FightController(app,player1,player2){
    this.app = app;
    this.player1 = player1;
    this.player2 = player2;
}

FightController.prototype.start = function(){
    return Promise.all([
        this.initPlayer(this.player1,this.player2),
        this.initPlayer(this.player2,this.player1)
    ]);
};

FightController.prototype.stop = function(){
    return Promise.all([
        this.deInitPlayer(player1),
        this.deInitPlayer(player2)
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

module.exports = FightController;