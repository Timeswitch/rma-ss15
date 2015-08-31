/**
 * Created by michael on 24/07/15.
 */

var Promise = require('Bluebird');
var RobotPart = require('../Models/RobotPart.js');
var Scan = require('../Models/Scan.js');

function ConnectionController(socket,app){
    this.socket = socket;
    this.app = app;

    this.user = null;

    this.init();
}

ConnectionController.prototype.init = function(){
    var self = this;
    this.socket.on('disconnect',this.onDisconnect.bind(this));
    this.socket.on('register',this.onRegister.bind(this));
    this.socket.on('login',this.onLogin.bind(this));
    this.socket.on('scan',this.onScan.bind(this));

    new RobotPart().fetchAll().then(function(items){
        self.socket.emit('sync',{
            id: self.socket.id,
            items: items.toJSON()
        });
    });

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
    }).catch(function(){
        console.log('Ungültiger Loginversuch (Benutzer existiert nicht), erzeuge neuen Benuzter...');
        self.onRegister();
    });
};

ConnectionController.prototype.onLoggedIn = function(){
    var self = this;

    Promise.all([this.user.getItemPivot(),this.user.getFriends()])
    .then(function(data){
        self.socket.emit('loggedIn',{
            user: self.user.toJSON({shallow: true}),
            robot: self.user.related('robot').toJSON({shallow: true}),
            inventory: data[0],
            friends: data[1]
        });
        console.log('Spieler ' + self.user.get('username') + ' hat sich angemeldet.');
    });

};

ConnectionController.prototype.onScan = function(data){
    var self = this;
    var code = data.code;

    this.user.scans().query({where: {code: data.code}}).fetchOne({require: true})
        .then(function(scan){
                var currentDate = (new Date().toISOString().substring(0,10));
                if(scan.get('lastscan') == currentDate){
                    self.socket.emit('scanResult',{valid: false});
                }else{
                    scan.save({lastscan: currentDate},{patch: true}).then(function(){
                        self.getLoot().then(function(loot){
                            if(loot > 0){
                                self.socket.emit('scanResult',{status: 'valid', item: loot});
                            }else{
                                self.socket.emit('scanResult',{status: 'empty', item: loot});
                            }
                            self.sendUpdate();
                        });
                    });
                }
        })
        .catch(function(){
            Scan.forge({user_id: self.user.id, code: code, lastscan: (new Date()).toISOString().substring(0,10)}).save()
                .then(function(scan){
                    self.getLoot().then(function(loot){
                        self.user.addItem(loot)
                            .then(function(){
                                if(loot > 0){
                                    self.socket.emit('scanResult',{status: 'valid', item: loot});
                                }else{
                                    self.socket.emit('scanResult',{status: 'empty', item: loot});
                                }
                                self.sendUpdate();
                            });
                    });
                });
        });
};

ConnectionController.prototype.getLoot = function(){
    return (new RobotPart()).fetchAll()
        .then(function(items){

            var loot = Math.floor(Math.random() * 2);

            if(loot == 1) {

                var arr = items.toJSON({shallow: true});
                var lootArr = [];

                loot = Math.floor(Math.random() * 3);

                //teilung der items nach seltenheit
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].rarity <= loot) {
                        lootArr.push(arr[i]);
                    }
                }

                loot = Math.floor(Math.random() * lootArr.length);

                return lootArr[loot].id;

            }else{

                return 0;
            }
        });
};

ConnectionController.prototype.sendUpdate = function(){
    var self = this;

    Promise.all([this.user.getItemPivot(),this.user.getFriends()]).then(function(data){
        self.socket.emit('update',{
            inventory: data[0],
            friendlist: data[1]
        })
    });
};

module.exports = ConnectionController;