/**
 * Created by michael on 31/07/15.
 */

var database = require('../Database.js');

var User = require('./User.js');
var RobotPart = require('./Robotpart.js');

var Robot = database.Model.extend({
    tableName: 'robot',
    user: function(){
        return this.belongsTo('User','user_id');
    },
    //head: function(){
    //    return this.hasOne(RobotPart,'head');
    //},
    //body: function(){
    //    return this.hasOne(RobotPart,'body');
    //},
    //arms: function(){
    //    return this.hasOne(RobotPart,'arms');
    //},
    //legs: function(){
    //    return this.hasOne(RobotPart,'legs');
    //}

});

module.exports = database.model('Robot',Robot);