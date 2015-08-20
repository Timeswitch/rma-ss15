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
        return this.belongsToMany('User','friends','user_id2');
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
    }

});

module.exports = database.model('User',User);