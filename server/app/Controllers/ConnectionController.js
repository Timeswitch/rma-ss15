/**
 * Created by michael on 24/07/15.
 */

function ConnectionController(socket,app){
    this.socket = socket;
    this.app = app;
    this.init();
}

ConnectionController.prototype.init = function(){
    this.socket.emit('welcome',{
        message: 'Welcome!',
        id: this.socket.id
    });

    this.socket.on('disconnect',this.onDisconnect.bind(this));
};

ConnectionController.prototype.onDisconnect = function(){
    this.app.onDisconnect(this);
};

module.exports = ConnectionController;