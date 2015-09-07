/**
 * Created by michael on 24/07/15.
 */

var Promise = require('bluebird');
var RobotPart = require('../Models/RobotPart.js');
var Scan = require('../Models/Scan.js');
var User = require('../Models/User.js');

function ConnectionController(socket,app){
    this.socket = socket;
    this.app = app;

    this.user = null;
    this.fight = null;

    this.updateCallback = null;
    this.requestFightCallback = null;
    this.stopFightCallback = null;

    this.init();
}

ConnectionController.prototype.init = function(){
    var self = this;
    this.socket.on('disconnect',this.onDisconnect.bind(this));
    this.socket.on('register',this.onRegister.bind(this));
    this.socket.on('login',this.onLogin.bind(this));
    this.socket.on('scan',this.onScan.bind(this));
    this.socket.on('addFriend',this.onAddFriend.bind(this));
    this.socket.on('removeFriend',this.onRemoveFriend.bind(this));
    this.socket.on('recycle',this.onRecycle.bind(this));
    this.socket.on('saveRobot',this.onSaveRobot.bind(this));
    this.socket.on('updateReceived',this.onUpdateReceived.bind(this));
    this.socket.on('requestFight',this.onRequestFight.bind(this));
    this.socket.on('fightRequestResult',this.onFightRequestResult.bind(this));
    this.socket.on('fightStopped',this.onFightStopped.bind(this));
    this.socket.on('ready',this.onReady.bind(this));

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
        username: data.username,
        logintoken: this.socket.id
    })
        .then(function(user){
            self.user = user;

            console.log('Benutzer ' + self.user.get('username') + ' registriert!');

            self.socket.emit('registerResult',{
                success: true,
                user: user.toJSON()
            });
        })
        .catch(function(){
            self.socket.emit('registerResult',{
                success: false
            });
        });
};

ConnectionController.prototype.onLogin = function(data){
    var self = this;
    this.app.getUser(data.user.username).then(function(user){
        if(user.get('logintoken') == data.user.logintoken){
            self.user = user;
            self.onLoggedIn();
        }else{
            console.log('Ungültiger Loginversuch (Benutzer ungültiget Token "'+data.user.logintoken+'" != "'+user.get('logintoken')+'")');
            self.socket.emit('loginFailed');
        }
    }).catch(function(){
        console.log('Ungültiger Loginversuch (Benutzer existiert nicht), erzeuge neuen Benuzter...');
        self.onRegister({username: data.user.username});
    });
};

ConnectionController.prototype.onLoggedIn = function(){
    var self = this;

    this.user.set('logintoken',self.socket.id);
    Promise.all([this.user.getItemPivot(),this.user.getFriends()])
    .then(function(data){
        self.socket.emit('loggedIn',{
            user: self.user.toJSON({shallow: true}),
            robot: self.user.related('robot').toJSON({shallow: true}),
            inventory: data[0],
            friends: data[1]
        });
        console.log('Spieler ' + self.user.get('username') + ' hat sich angemeldet.');
        self.app.mapUser(self.user.get('username'),self);
    });

};

ConnectionController.prototype.onReady = function(){
    this.user.save()
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
                                self.user.addItem(loot).then(function(){
                                    self.sendUpdate().then(function(){
                                        self.socket.emit('scanResult',{status: 'valid', item: loot});
                                    });
                                });
                            }else{
                                self.socket.emit('scanResult',{status: 'empty', item: loot});
                            }
                        });
                    });
                }
        })
        .catch(function(){
            Scan.forge({user_id: self.user.id, code: code, lastscan: (new Date()).toISOString().substring(0,10)}).save()
                .then(function(scan){
                    self.getLoot().then(function(loot){
                        if(loot > 0){
                            self.user.addItem(loot).then(function(){
                                self.sendUpdate().then(function(){
                                    self.socket.emit('scanResult',{status: 'valid', item: loot});
                                });
                            });
                        }else{
                            self.socket.emit('scanResult',{status: 'empty', item: loot});
                        }
                    });
                });
        });
};

ConnectionController.prototype.onAddFriend = function(data){
    var self = this;
    this.user.addFriend(data.username).then(function(code){
        self.sendUpdate().then(function(){
            self.socket.emit('friendAdded',{
                code: code
            });
        });
    });

};

ConnectionController.prototype.onRemoveFriend = function(data){
    var self = this;
    this.user.removeFriend(data.id).then(function(){
        self.sendUpdate().then(function(){
            self.socket.emit('friendRemoved');
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
    return new Promise(function(resolve){
        self.updateCallback = resolve;
        Promise.all([self.user.getItemPivot(),self.user.getFriends(),self.user.robot().fetch()]).then(function(data){
            self.socket.emit('update',{
                inventory: data[0],
                friendlist: data[1],
                robot: data[2]
            })
        });
    });
};

ConnectionController.prototype.onUpdateReceived = function(){
    if(this.updateCallback){
        this.updateCallback();
        this.updateCallback = null;
    }
};

ConnectionController.prototype.onRecycle = function(data){
    var self= this;
    var items = data.items;
    var prom = [];
    for(var i = 0; i < items.length; i++){
        prom.push(this.user.removeItem(items[i].item, items[i].count));
    }
    return Promise.all(prom).then(function(){
        var erg = 0;
        for(var i = 0; i < items.length; i++){
            erg += items[i].count;
        }
        if(erg < 2){
            if(Math.floor(Math.random() * 3) == 0){
                return self.getLoot();
            }else{
                return 0;
            }
        }
        else if(erg < 3){
            if(Math.floor(Math.random() * 2) == 0){
                return self.getLoot();
            }else{
                return 0;
            }
        }
        else if(erg > 3){
            return self.getLoot();
        }
    }).then(function(item){
        new RobotPart({id: item}).fetch({require: true}).then(function(item){
            self.user.addItem(item.id).then(function(){
                self.sendUpdate().then(function(){
                    self.socket.emit('recycleResult',{
                        success: true,
                        item: item.toJSON()
                    });
                });
            });

        }).catch(function() {
            self.sendUpdate().then(function(){
                self.socket.emit('recycleResult', {
                    success: false
                });
            });

        });
    });

};

ConnectionController.prototype.onSaveRobot = function(data){
    var self = this;
    return this.user.saveRobot(data.config).then(function(){
        return self.sendUpdate().then(function(){
            self.socket.emit('robotSaved');
        });
    });
};

ConnectionController.prototype.onRequestFight = function(data){
    var self = this;
    return new User({id: data.user}).fetch({require: true}).then(function(user){
        if(!self.app.isOnline(user.get('username'))){
            self.socket.emit('requestFightResult',{
                status: 'OFFLINE'
            })
        }else{
            var connection = self.app.getUserConnection(user.get('username'));

            connection.requestFight(self).then(function(data){

                if(data.status == 'ACCEPT'){
                    self.app.startFight(self,connection);
                }else{
                    self.socket.emit('requestFightResult',{
                        status: data.status,
                        username: user.get('username')
                    });
                }


            });
        }
    }).catch(function(){
        self.socket.emit('requestFightResult',{
            status: 'NOT_FOUND'
        });
    });
};

ConnectionController.prototype.requestFight = function(connection){
    var self = this;
    return new Promise(function(resolve){
        self.requestFightCallback = resolve;

        self.socket.emit('requestFight',{
            username: connection.user.get('username')
        })

    });
};

ConnectionController.prototype.onFightRequestResult = function(data){
    if(this.requestFightCallback){
        this.requestFightCallback(data);
        this.requestFightCallback = null;
    }
};

ConnectionController.prototype.stopFight = function(){
    var self = this;

    this.fight = null;

    return new Promise(function(resolve){
        if(!self.socket.connected){
            resolve();
            return;
        }
        self.stopFightCallback = resolve;
        self.socket.emit('stopFight');
    });
};

ConnectionController.prototype.onFightStopped = function(data){
    if(this.stopFightCallback){
        this.stopFightCallback(data);
        this.stopFightCallback = null;
    }
};

module.exports = ConnectionController;