/**
 * Created by michael on 28/07/15.
 */

var database = require('../Database.js');

var Robot = require('./Robot.js');

var Scans = require('./Scans.js');

var User = database.Model.extend({
    tableName: 'user',
    robot: function(){
        return this.hasOne(Robot);
    },
    scans: function(){
        return this.hasMany(Scans);
    }

});

module.exports = User;