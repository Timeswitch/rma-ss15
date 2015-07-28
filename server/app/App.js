/**
 * Created by michael on 24/07/15.
 */

var Promise = require('bluebird');
var ConnectionController = require('./Controllers/ConnectionController.js');
var User = require('./Models/User.js');

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

App.prototype.createUser = Promise.method(function(data){
    return User.forge(data).save();
});

module.exports = App;