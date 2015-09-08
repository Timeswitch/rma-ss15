/**
 * Created by michael on 07/09/15.
 */

var Promise = require('bluebird');

function FightController(app,player1,player2){
    this.app = app;
    this.player1 = player1;
    this.player2 = player2;

    this.readyCount = 0;

    this.activePlayer = {
        connection: player1,
        life: 50,
        defending: false
    };

    this.pausedPlayer = {
        connection: player2,
        life: 50,
        defending: false
    };
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
    var self = this;
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
        this.activePlayer.connection.socket.emit('fightCommand',{
            command: 'active'
        })
    }
};

FightController.prototype.parseCommand = function(data){
    var player = data.who;

    switch(data.command){
        case 'ready':
            this.onPlayerReady();
            return;
            break;
        case 'abort':
            this.app.stopFight(player);
            return;
    }

    if(!this.activePlayer.connection == player || this.readyCount < 2){
        return;
    }

    switch(data.command){
        case 'attack':
            this.attack();
            break;
        case 'defend':
            this.defend();
            break;
    }

};

FightController.prototype.endRound = function(){
    var pause = this.activePlayer;
    this.activePlayer = this.pausedPlayer;
    this.pausedPlayer = pause;

    this.pausedPlayer.connection.socket.emit('fightCommand',{
        command: 'wait'
    });
};

FightController.prototype.attack = function(){
    var self = this;

    return Promise.all([
        this.activePlayer.connection.user.robot().fetch({require: true, withRelated: ['head','body','arms','legs']}),
        this.pausedPlayer.connection.user.robot().fetch({require: true, withRelated: ['head','body','arms','legs']})
    ]).then(function(robots){
        var attackRobot = robots[0].getValues();
        var defenseRobot = robots[1].getValues();

        if(self.pausedPlayer.defending){
            self.pausedPlayer.defending = false;
            defenseRobot.defense *= 2;
        }

        var damage = attackRobot.attack - ((attackRobot.attack/100) * defenseRobot.defense);
        
        if(damage < 0){
            damage = 0;
        }
        
        if(attackRobot.agility > defenseRobot.agility){
            if(Math.floor(Math.random() * 2) == 0) {
                damage *= 2;
            }
        }else if(attackRobot.agility < defenseRobot.agility){
            if(Math.floor(Math.random() * 2) == 0){
                damage = 0;
            }
        }

        damage = Math.floor(damage);
        self.pausedPlayer.life -= damage;
        if(self.pausedPlayer.life <= 0){
            self.pausedPlayer.life = 0;
        }

        self.pausedPlayer.connection.socket.emit('fightCommand',{
            command: 'enemyAttack',
            param: {
                life: self.pausedPlayer.life
            }
        });

        self.activePlayer.connection.socket.emit('fightCommand',{
            command: 'updateEnemy',
            param: {
                life: self.pausedPlayer.life
            }
        });

        self.endRound();

        if(life == 0){
            self.app.stopFight(self.pausedPlayer.connection);
        }


    });
    
};

FightController.prototype.defend = function(){
    this.activePlayer.defending = true;
    this.endRound();
};

module.exports = FightController;