/**
 * Created by michael on 28/07/15.
 */

var database = require('../Database.js');

var Robot = require('./Robot.js');
var RobotPart = require('./RobotPart.js');
var Scan = require('./Scan.js');

var User = database.Model.extend({
    tableName: 'user',
    robot: function(){
        return this.hasOne('Robot','user_id');
    },
    scans: function(){
        return this.hasMany('Scan');
    },
    friends: function(){
        return this.belongsToMany('User','friends','user_id','user_id2');
    },
    inventory: function(){
        return this.belongsToMany('RobotPart','inventar','user_id','robotpart_id').withPivot('count');
    },
    addItem: function(item){
        var self = this;
        var item = item;
        return this.inventory().query({where: {id: item}}).fetchOne({require: true})
            .then(function(item){
                return self.inventory().query({where:{id: item.id}}).updatePivot({count: item.pivot.get('count')+1});
            }).catch(function(){
                return self.inventory().attach({user_id: self.id, robotpart_id: item, count: 1});
            });
    },
    removeItem: function(item) {
        return this.inventory().query({where: {id: item}}).fetchOne({require: true})
            .then(function(item){
                if(item.pivot.get('count') < 1){
                    return false;
                }

                return self.inventory().query({where:{id: item.id}}).updatePivot({count: item.pivot.get('count')-1})
                    .then(function(){
                        return true;
                    });

            }).catch(function(e){
                return false;
            })

    },
    getItemPivot: function() {
        return this.inventory().fetch().then(function (items) {
            var pivot = [];

            for (var i = 0; i < items.length; i++) {
                var itemPivot = items.at(i).pivot.toJSON();
                itemPivot.id = itemPivot.robotpart_id;
                pivot.push(itemPivot);
            }

            return pivot;
        });
    },
    getFriends: function(){
        var self = this;
        return this.friends().fetch().then(function(users){
            var friends = [];

            for(var i = 0; i<users.length; i++){
                var user = users.at(i);
                friends.push({
                    id: user.id,
                    user_id: self.id,
                    username: user.get('username')
                });
            }

            return friends;
        });
    },
    addFriend: function(user){
        var self = this;
        var username = user;
        return this.friends().query({where: {username: username}}).fetchOne({require: true})
            .then(function(user){
                return 'EXISTS';
            })
            .catch(function(){
                return (new User({username: username})).fetch({require:true}).then(function(user){
                    return self.friends().attach(user.id).then(function(){
                        return 'SUCCESS';
                    }).catch(function(){
                        return 'ERROR';
                    });
                }).catch(function(){
                    return 'NOT_FOUND';
                });

            });
    },
    removeFriend: function(id) {
        var self = this;
        return this.friends().query({where: {id: id}}).fetchOne({require: true})
            .then(function(user){
                return self.friends().detach(user.id)
                    .then(function(){
                        return true;
                    });

            }).catch(function(e){
                return false;
            })

    }

});

module.exports = database.model('User',User);