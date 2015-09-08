/**
 * Created by michael on 24/07/15.
 */

var Promise = require('bluebird');
var ConnectionController = require('./Controllers/ConnectionController.js');
var FightController = require('./Controllers/FightController.js');
var User = require('./Models/User.js');
var Robot = require('./Models/Robot.js');

function App(io,server,database,config){
    this.io = io;
    this.server = server;
    this.database = database;
    this.config = config;

    this.connections = [];
    this.fights = [];
    this.userMap = {};
    this.lobby = [];

    this.init();
}

App.prototype.init = function(){

    this.io.on('connection',this.onConnect.bind(this));
};

App.prototype.start = function(){
    this.server.listen(this.config.game.port);
};

App.prototype.onConnect = function(socket){
    this.connections.push(new ConnectionController(socket,this));
    console.log('Ein Spieler hat sich verbunden.');
};

App.prototype.onDisconnect = function(connection){
    if(connection.user){
        this.unmapUser(connection.user.get('username'));
    }
    this.connections.splice(this.connections.indexOf(connection),1);
    console.log('Spieler hat die Verbindung unterbrochen.');
};

App.prototype.createUser = function(data){
    var self = this;
    return User.forge(data).save().then(function(user){
        return Robot.forge({
            user_id: user.id,
            head_id: self.config.game.defaultRobot.head,
            body_id: self.config.game.defaultRobot.body,
            arms_id: self.config.game.defaultRobot.arms,
            legs_id: self.config.game.defaultRobot.legs
        }).save().then(function(robot){
            return robot.user().fetch({require: true, withRelated: ['robot']});
        })
    });
};

App.prototype.getUser = function(username){
    return (new User({username: username}).fetch({require: true, withRelated: ['robot','friends']}));
};

App.prototype.mapUser = function(username,connection){
    this.userMap[username] = connection;
};

App.prototype.unmapUser = function(username){
    var user = this.getUserConnection(username);
    if(user){
        this.stopFight(user,'abort');
    }
    delete this.userMap[username];
};

App.prototype.isOnline = function(username) {
    return this.userMap.hasOwnProperty(username);
};

App.prototype.getUserConnection = function(username){
    return this.userMap[username];
};

App.prototype.startFight = function(player1,player2){
    var fight = new FightController(this,player1,player2);
    this.fights.push(fight);

    fight.start();
};

App.prototype.stopFight = function(userconnection,reason){
    if(userconnection.fight){
        var fight = userconnection.fight;
        fight.stop({
            looser: userconnection,
            reason: reason
        });

        this.fights.splice(fight,1);
    }
};

App.prototype.joinLobby = function(userconnection){
    if(this.lobby.length > 0){
        var i = this.lobby.length-1;
        var enemy = this.lobby[i];
        this.lobby.splice(i,i+1);
        this.startFight(userconnection,enemy);
    }else{
        this.lobby.push(userconnection);
    }
};

App.prototype.leaveLobby = function(userconnection){
    var i = this.lobby.indexOf(userconnection);

    if(i){
        this.lobby.splice(i,1);
    }
};

App.prototype.transferPrize = function(result){

    function arrayShuffle(){
        var tmp, rand;
        for(var i =0; i < this.length; i++){
            rand = Math.floor(Math.random() * this.length);
            tmp = this[i];
            this[i] = this[rand];
            this[rand] =tmp;
        }
    }

    if(result.reason == 'death'){
        var fields = ['head_id','arms_id','legs_id'];
        arrayShuffle.call(fields);


        return result.looser.user.robot().fetch({require: true})
            .then(function(robot){
                var item = null;
                var field = null;

                for(var i = 0; i< fields.length; i++){
                    if(robot.get(fields[i])){
                        field = fields[i];
                        item = robot.get(fields[i]);
                        break;
                    }
                }

                if(field){
                    robot.set(field,null);
                }

                result.prize = item;

                return Promise.all([
                    robot.save(),
                    result.winner.user.addItem(item)
                ]);
            });
    }else{
        return result.looser.user.getItemPivot()
            .then(function(items){
                arrayShuffle.call(items);

                var item = (items[0] ? items[0].id : null);

                result.prize = item;

                return Promise.all([
                    result.winner.user.addItem(item),
                    result.looser.user.removeItem(item,1)
                ]);
            });
    }
};

module.exports = App;