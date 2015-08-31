/**
 * Created by michael on 31/07/15.
 */

var database = require('../Database.js');

var User = require('./User.js');
var RobotPart = require('./RobotPart.js');

var Robot = database.Model.extend({
    tableName: 'robot',
    user: function(){
        return this.belongsTo('User','user_id');
    },
    head: function(){
        return this.belongsTo(RobotPart,'head_id');
    },
    body: function(){
        return this.belongsTo(RobotPart,'body_id');
    },
    arms: function(){
        return this.belongsTo(RobotPart,'arms_id');
    },
    legs: function(){
        return this.belongsTo(RobotPart,'legs_id');
    }

});

module.exports = database.model('Robot',Robot);