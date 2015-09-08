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
    },
    item: function(){
        return this.belongsTo(RobotPart,'item_id');
    },
    getValues: function(){
        return {
            attack: (this.related('head').get('attack') || 0) + (this.related('body').get('attack') || 0)+ (this.related('arms').get('attack') || 0)+ (this.related('legs').get('attack')|| 0),
            defense: (this.related('head').get('defense') || 0) + (this.related('body').get('defense') || 0)+ (this.related('arms').get('defense') || 0)+ (this.related('legs').get('defense')|| 0),
            agility: (this.related('head').get('agility') || 0) + (this.related('body').get('agility') || 0)+ (this.related('arms').get('agility') || 0)+ (this.related('legs').get('agility')|| 0),
        };
    }

});

module.exports = database.model('Robot',Robot);