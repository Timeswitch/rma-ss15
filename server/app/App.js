/**
 * Created by michael on 24/07/15.
 */

var ConnectionController = require('./Controllers/ConnectionController.js');

function App(io,server){
    this.io = io;
    this.server = server;

    this.connections = [];

    this.init();
}

App.prototype.init = function(){

    this.io.on('connection',this.onConnect.bind(this));
};

App.prototype.onConnect = function(socket){
    this.connections.push(new ConnectionController(socket,this));
    console.log('Ein Spieler hat sich verbunden.');
};

App.prototype.onDisconnect = function(connection){
    this.connections.splice(this.connections.indexOf(connection),1);
    console.log('Spieler hat die verbindung unterbrochen.');
};

App.prototype.start = function(){
    this.server.listen(2209);
};

module.exports = App;