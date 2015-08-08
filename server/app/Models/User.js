/**
 * Created by michael on 28/07/15.
 */

var database = require('../Database.js');

var Robot = require('./Robot.js');

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
    }

});

module.exports = database.model('User',User);