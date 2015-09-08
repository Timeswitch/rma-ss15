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
        defending: false,
        extraAttack: 0,
        extraDefense: 0,
    };

    this.pausedPlayer = {
        connection: player2,
        life: 50,
        defending: false,
        extraAttack: 0,
        extraDefense: 0
    };

    this.result = {
        looser: null,
        reason: null
    };
}

FightController.prototype.start = function(){
    return Promise.all([
        this.initPlayer(this.player1,this.player2),
        this.initPlayer(this.player2,this.player1)
    ]);
};

FightController.prototype.stop = function(result){
    var self = this;

    var winner = this.player1;
    if(result.looser == winner){
        winner = this.player2;
    }

    result.winner = winner;

    return this.app.transferPrize(result).then(function(){
        var prom = [];

        if(result.winner.socket.connected){
            prom.push(result.winner.sendUpdate());
        }

        if(result.looser.socket.connected){
            prom.push(result.looser.sendUpdate());
        }

        return Promise.all(prom).then(function(){
            return Promise.all([
                self.deInitPlayer(self.player1,result),
                self.deInitPlayer(self.player2,result)
            ]);
        });
    });
};

FightController.prototype.deInitPlayer = function(player,result){
    return player.stopFight(result);
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
            this.app.stopFight(player,'abort');
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
        case 'item':
            this.useItem();
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

        attackRobot.attack += self.activePlayer.extraAttack;
        defenseRobot.defense += self.pausedPlayer.extraDefense;

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

        if(self.activePlayer.life == 0){
            self.app.stopFight(self.activePlayer.connection,'death');
        }


    });
    
};

FightController.prototype.defend = function(){
    this.activePlayer.defending = true;
    this.endRound();
    this.activePlayer.connection.socket.emit('fightCommand',{
        command: 'active'
    });
};

FightController.prototype.useItem = function(){
    var self = this;

    return this.activePlayer.connection.user.robot().fetch({require: true, withRelated: ['head','body','arms','legs']})
        .then(function(robot){
            return robot.related('item').fetch({require:true}).then(function(item){

                var life = null;

                if(item.get('attack')){
                    self.activePlayer.extraAttack = item.get('attack');
                }else if(item.get('defense')){
                    self.activePlayer.extraDefense = item.get('defense');
                }else if(item.get('agility')){
                    self.activePlayer.life += item.get('agility');
                    if(self.activePlayer.life > 50){
                        self.activePlayer.life = 50;
                    }

                    life = self.activePlayer.life;
                }

                robot.set('item_id',null);

                return robot.save().then(function(){
                    self.pausedPlayer.connection.socket.emit('fightCommand',{
                        command: 'enemyItem',
                        param: {
                            life: life
                        }
                    });

                    self.endRound();

                    self.activePlayer.connection.socket.emit('fightCommand',{
                        command: 'active'
                    });
                });

            });

        });
};

module.exports = FightController;