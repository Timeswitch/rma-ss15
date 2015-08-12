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
    head: function(){
        return this.belongsTo(RobotPart,'head');
    },
    body: function(){
        return this.belongsTo(RobotPart,'body');
    },
    arms: function(){
        return this.belongsTo(RobotPart,'arms');
    },
    legs: function(){
        return this.belongsTo(RobotPart,'legs');
    }

});

module.exports = database.model('Robot',Robot);