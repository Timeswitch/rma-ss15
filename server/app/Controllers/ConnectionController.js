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
    this.socket.on('login',this.onLogin.bind(this));
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

        console.log('Benutzer ' + self.user.get('username') + ' registriert!');

        self.onLoggedIn();
    });
};

ConnectionController.prototype.onLogin = function(data){
    var self = this;
    this.app.getUser(data.user.username).then(function(user){
        if(user.get('logintoken') == data.user.logintoken){
            self.user = user;
            self.user.set('logintoken',self.socket.id);
            self.user.save().then(function(){
                self.onLoggedIn();
            });
        }else{
            console.log('Ungültiger Loginversuch (Benutzer ungültiget Token "'+data.user.logintoken+'" != "'+user.get('logintoken')+'"), erzeuge neuen Benuzter...');
            self.onRegister();
        }
    }).error(function(){
        console.log('Ungültiger Loginversuch (Benutzer existiert nicht), erzeuge neuen Benuzter...');
        self.onRegister();
    });
};

ConnectionController.prototype.onLoggedIn = function(){
    this.socket.emit('loggedIn',{
        user: this.user.toJSON(),
        robot: this.user.robot().toJSON()
    });

    console.log('Spieler ' + this.user.get('username') + ' hat sich angemeldet.');
};

module.exports = ConnectionController;