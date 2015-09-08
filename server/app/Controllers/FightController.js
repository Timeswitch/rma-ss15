/**
 * Created by michael on 07/09/15.
 */

var Promise = require('bluebird');

function FightController(app,player1,player2){
    this.app = app;
    this.player1 = player1;
    this.player2 = player2;

    this.player1Robot = null;
    this.player2Robot = null;

    this.player1Life = 50;
    this.player2Life = 50;

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
    var self = this;
    player.fight = this;

    return enemy.user.robot().fetch({require: true, withRelated: ['head','body','arms','legs']}).then(function(robot){
        if(self.player1 == player){
            self.player1Robot = robot;
        }else{
            self.player2Robot = robot;
        }

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
        this.activePlayer.socket.emit('fightCommand',{
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

    if(!this.currentPlayer == player || this.readyCount < 2){
        return;
    }

    switch(data.command){
        case 'attack':
            this.attack();
            break;
    }

    var pause = this.activePlayer;
    this.activePlayer = this.pausedPlayer;
    this.pausedPlayer = pause;

    this.pausedPlayer.socket.emit('fightCommand',{
        command: 'wait'
    });
};

FightController.prototype.attack = function(){

    var attack = this.getRobot(this.activePlayer).getValues().attack;
    var defense = this.getRobot(this.pausedPlayer).getValues().defense;

    var agilityAttacker = this.getRobot(this.activePlayer).getValues().agility;
    var agilityDefender = this.getRobot(this.pausedPlayer).getValues().agility;

    var damage = attack - ((attack/100) * defense);

    if(agilityAttacker > agilityDefender){
        if(Math.floor(Math.random() * 2) == 0) {
            damage *= 2;
        }
    }else if(agilityAttacker < agilityDefender){
        if(Math.floor(Math.random() * 2) == 0){
            damage = 0;
        }
    }

    damage = Math.floor(damage);

    var life = this.getLife(this.pausedPlayer);

    life -= damage;
    if(life <= 0){
        life = 0;
    }

    this.setLife(this.pausedPlayer,life);
    this.pausedPlayer.socket.emit('fightCommand',{
        command: 'enemyAttack',
        param: {
            life: life
        }
    });

    this.activePlayer.socket.emit('fightCommand',{
        command: 'updateEnemy',
        param: {
            life: life
        }
    });

    if(life == 0){
        this.app.stopFight(this.pausedPlayer);
    }
};

FightController.prototype.getRobot = function(player){
    if(this.player1 == player){
        return this.player1Robot;
    }else{
        return this.player2Robot;
    }
};

FightController.prototype.setLife = function(player,life){
    if(this.player1 == player){
        this.player1Life = life;
    }else{
        this.player2Life = life;
    }
};

FightController.prototype.getLife = function(player){
    if(this.player1 == player){
        return this.player1Life;
    }else{
        return this.player2Life;
    }
};

module.exports = FightController;