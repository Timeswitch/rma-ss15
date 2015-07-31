/**
 * Created by michael on 24/07/15.
 */

define(['socket.io'],function(io){

    function ConnectionController(app,server){
        this.app = app;
        this.socket = io(server);
        this.id = -1;

        this.socket.on('welcome',this.onConnect.bind(this));

        this.socket.on('loggedIn',this.onLoggedIn.bind(this));
    }

    ConnectionController.prototype.onConnect = function(data){
        this.id = data.id;

        if(this.app.user === null){
            this.register();
        }else{
            this.login();
        }
    };

    ConnectionController.prototype.onLoggedIn = function(data){
        this.app.saveUser(data.user);
        this.app.robot = data.robot;
        console.log(data.robot);
        this.app.startState('Menu');
    };

    ConnectionController.prototype.register = function(){
        this.socket.emit('register');
    };

    ConnectionController.prototype.login = function(){
        this.socket.emit('login',{
            user: this.app.user
        });
    };


    return ConnectionController;
});