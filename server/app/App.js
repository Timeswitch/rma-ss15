/**
 * Created by michael on 24/07/15.
 */

var Promise = require('bluebird');
var ConnectionController = require('./Controllers/ConnectionController.js');
var User = require('./Models/User.js');
var Robot = require('./Models/Robot.js');

function App(io,server,database,config){
    this.io = io;
    this.server = server;
    this.database = database;
    this.config = config;

    this.connections = [];

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
    this.connections.splice(this.connections.indexOf(connection),1);
    console.log('Spieler hat die Verbindung unterbrochen.');
};

App.prototype.createUser = function(data){

    return User.forge(data).save().then(function(user){
        return Robot.forge({
            user_id: user.id,
            head: 1,
            body: 2,
            arms: 3,
            legs: 4
        }).save().then(function(robot){
            return robot.user().fetch({withRelated: ['robot']});
        })
    });
};

App.prototype.getUser = function(username){
    return (new User({username: username}).fetch({require: true, withRelated: ['robot']}));
};

module.exports = App;