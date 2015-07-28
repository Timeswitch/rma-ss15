/**
 * Created by michael on 24/07/15.
 */

function ConnectionController(socket,app){
    this.socket = socket;
    this.app = app;

    this.user = null;

    this.init();
}

ConnectionController.prototype.init = function(){
    this.socket.emit('welcome',{
        id: this.socket.id
    });

    this.socket.on('disconnect',this.onDisconnect.bind(this));

    this.socket.on('register',this.onRegister.bind(this));
};

ConnectionController.prototype.onDisconnect = function(data){
    this.app.onDisconnect(this);
};

ConnectionController.prototype.onRegister = function(data){
    var self = this;
    this.user = this.app.createUser({
        username: 'demouser_' + this.socket.id,
        logintoken: this.socket.id
    }).then(function(user){
        self.user = user;
        self.onLoggedIn();
    });
};

ConnectionController.prototype.onLoggedIn = function(){
    this.socket.emit('loggedIn',{
        user: this.user.toJSON()
    });
};

module.exports = ConnectionController;