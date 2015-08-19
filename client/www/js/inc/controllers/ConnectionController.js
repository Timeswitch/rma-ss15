/**
 * Created by michael on 24/07/15.
 */

define(['socket.io'],function(io){

    function ConnectionController(app,server){
        this.app = app;
        this.socket = io(server);
        this.id = -1;
        this.scanCallback = null;

        this.socket.on('sync',this.onConnect.bind(this));

        this.socket.on('loggedIn',this.onLoggedIn.bind(this));
        this.socket.on('scanResult',this.onScanResult.bind(this));
    }

    ConnectionController.prototype.onConnect = function(data){
        this.id = data.id;

        this.app.injectData('RobotPart',data.items);

        if(this.app.user === null){
            this.register();
        }else{
            this.login();
        }
    };

    ConnectionController.prototype.onLoggedIn = function(data){
        this.app.injectData('User',data.user);
        this.app.injectData('Robot',data.robot);

        this.app.saveUser(data.user.id);

        this.app.startState('Menu');
    };

    ConnectionController.prototype.onScanResult = function(data){
        if(this.scanCallback){
            this.scanCallback(data);
            this.scanCallback = null;
        }
    };

    ConnectionController.prototype.register = function(){
        this.socket.emit('register');
    };

    ConnectionController.prototype.login = function(){
        this.socket.emit('login',{
            user: this.app.user
        });
    };

    ConnectionController.prototype.sendCode = function(code,callback){
        console.log(code);

        this.scanCallback = callback;
        this.socket.emit('scan',{
            code: code
        });
    };


    return ConnectionController;
});