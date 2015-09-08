/**
 * Created by michael on 07/09/15.
 */

var Promise = require('bluebird');

function FightController(app,player1,player2){
    this.app = app;
    this.player1 = player1;
    this.player2 = player2;

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

};

FightController.prototype.endRound = function(){
    var pause = this.activePlayer;
    this.activePlayer = this.pausedPlayer;
    this.pausedPlayer = pause;

    this.pausedPlayer.socket.emit('fightCommand',{
        command: 'wait'
    });
};

FightController.prototype.attack = function(){
    var self = this;

    return Promise.all([
        this.activePlayer.user.robot().fetch({require: true, withRelated: ['head','body','arms','legs']}),
        this.pausedPlayer.user.robot().fetch({require: true, withRelated: ['head','body','arms','legs']})
    ]).then(function(robots){
        var attackRobot = data[0].getValues();
        var defenseRobot = data[1].getValues();

        var damage = attackRobot.attack - ((attackRobotattack/100) * defenseRobot.defense);
        
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

        var life = self.getLife(self.pausedPlayer);

        life -= damage;
        if(life <= 0){
            life = 0;
        }

        self.setLife(self.pausedPlayer,life);
        self.pausedPlayer.socket.emit('fightCommand',{
            command: 'enemyAttack',
            param: {
                life: life
            }
        });

        self.activePlayer.socket.emit('fightCommand',{
            command: 'updateEnemy',
            param: {
                life: life
            }
        });

        if(life == 0){
            self.app.stopFight(self.pausedPlayer);
        }


    });
    
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