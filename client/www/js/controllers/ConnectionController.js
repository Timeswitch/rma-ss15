/**
 * Created by michael on 24/07/15.
 */

define(['socket.io'],function(io){

    function ConnectionController(app,server){
        this.app = app;
        this.socket = io(server);
        this.id = -1;
        this.scanCallback = null;
        this.friendCallback = null;
        this.inventoryCallback = null;
        this.recycleCallback = null;
        this.saveRobotCallback = null;

        this.socket.on('sync',this.onConnect.bind(this));
        this.socket.on('disconnect',this.onDisconnect.bind(this));

        this.socket.on('loggedIn',this.onLoggedIn.bind(this));
        this.socket.on('scanResult',this.onScanResult.bind(this));
        this.socket.on('update',this.onUpdate.bind(this));
        this.socket.on('friendAdded',this.onFriendAdded.bind(this));
        this.socket.on('friendRemoved',this.onFriendRemoved.bind(this));
        this.socket.on('registerResult',this.onRegisterResult.bind(this));
        this.socket.on('loginFailed',this.onLoginFailed.bind(this));
        this.socket.on('recycleResult', this.onRecycleResult.bind(this));
        this.socket.on('robotSaved', this.onRobotSaved.bind(this));
        this.socket.on('requestFight',this.onRequestFight.bind(this));
        this.socket.on('requestFightResult',this.onRequestFightResult.bind(this));
        this.socket.on('stopFight',this.onStopFight.bind(this));
    }

    ConnectionController.prototype.onConnect = function(data){

        if(this.id !== -1){
            window.location.reload();
        }

        this.id = data.id;

        this.app.injectData('RobotPart',data.items);

        if(this.app.user === null){
            this.register();
        }else{
            this.login();
        }
    };

    ConnectionController.prototype.onDisconnect = function(){
        this.app.startState('NoConnection');
    };


    ConnectionController.prototype.onLoggedIn = function(data){
        this.app.injectData('User',data.user);
        this.app.saveUser(data.user.id);

        this.app.injectData('Robot',data.robot);
        this.app.injectData('Item',data.inventory);
        this.app.injectData('Friend',data.friends);

        this.socket.emit('ready');

        this.app.startState('Menu');
    };

    ConnectionController.prototype.onScanResult = function(data){
        if(this.scanCallback){
            this.scanCallback(data);
            this.scanCallback = null;
        }
    };

    ConnectionController.prototype.onUpdate = function(data){
        this.app.injectData('Item',data.inventory);
        this.app.injectData('Friend',data.friendlist);
        this.app.injectData('Robot',data.robot);

        this.app.game.state.getCurrentState().onDataUpdate();
        this.socket.emit('updateReceived');
    };

    ConnectionController.prototype.register = function(){
        var self = this;
        this.app.game.state.getCurrentState().showInput('Geb deinen Namen ein:',function(value,dialog){
            dialog.close();
            self.socket.emit('register',{username: value});
        });
    };

    ConnectionController.prototype.onRegisterResult = function(data){
        var self = this;
        if(!data.success){
            this.app.game.state.getCurrentState().showDialog('Info','Der Benutzer ist bereits vorhanden!',function(){
                self.register();
            });
        }else{
            this.app.injectData('User',data.user);
            this.app.saveUser(data.user.id);
            this.login();
        }
    };

    ConnectionController.prototype.onLoginFailed = function(data){
        this.login();
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

    ConnectionController.prototype.onFriendAdded= function(data){
        if(this.friendCallback){
            this.friendCallback(data);
            this.friendCallback = null;
        }
    };

    ConnectionController.prototype.onFriendRemoved = function(data){
        if(this.friendCallback){
            this.friendCallback();
        }
    };

    ConnectionController.prototype.addFriend = function(user, callback){

        this.friendCallback = callback;
        this.socket.emit('addFriend', {
            username: user
        });
    };

    ConnectionController.prototype.removeFriend = function(id,callback){
        this.friendCallback = callback;
        this.socket.emit('removeFriend',{
            id: id
        });
    };

    ConnectionController.prototype.onRecycleResult = function(data){
        if(this.recycleCallback){
            this.recycleCallback(data);
        }
    };

    ConnectionController.prototype.recycle = function(data, callback){
        this.recycleCallback = callback;
        this.socket.emit('recycle',{
            items: data

        });
    };

    ConnectionController.prototype.saveRobot = function(callback){
        this.saveRobotCallback = callback;
        this.socket.emit('saveRobot',{
            config: this.app.user.robot
        });
    };

    ConnectionController.prototype.onRobotSaved = function(data){
        if(this.saveRobotCallback){
            this.saveRobotCallback(data);
            this.saveRobotCallback = null;
        }
    };

    ConnectionController.prototype.requestFight = function(id){
        var state = this.app.getState();
        state.busy = true;

        state.showProgress();

        this.socket.emit('requestFight',{
            user: id
        });

    };

    ConnectionController.prototype.onRequestFightResult = function(data){
        var self = this;
        var state = this.app.getState();

        state.stopProgress(function(){
            switch(data.status){
                case 'ACCEPT':
                    self.app.startFight(data);
                    break;
                case 'BUSY':
                    state.showDialog('Hinweis',data.username + ' ist beschäftigt');
                    break;
                case 'DECLINE':
                    state.showDialog('Hinweis',data.username + ' hat abgelehnt.');
                    break;
                case 'OFFLINE':
                    state.showDialog('Der Spieler ist Offline');
                    break;
                default:
                    state.showDialog('Der Spieler wurde nicht gefunden');
            }
        });

    };

    ConnectionController.prototype.onRequestFight = function(data){
        var self = this;
        var state = this.app.getState();

        if(state.busy){
            this.socket.emit('fightRequestResult',{
                status: 'BUSY'
            });
        }else{
            state.showDialog('Kampf',data.username + ' fordert dich heraus!',function(){
                state.showProgress();
                self.socket.emit('fightRequestResult',{
                    status: 'ACCEPT'
                });

            },function(){
                self.socket.emit('fightRequestResult',{
                    status: 'DECLINE'
                });
            });
        }
    };

    ConnectionController.prototype.onStopFight = function(data){
        this.app.stopFight();
        this.socket.emit('fightStopped');
    };

    return ConnectionController;
});