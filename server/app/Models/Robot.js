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
    getValues: function(){
        return {
            attack: this.related('head').get('attack') + this.related('body').get('attack') + this.related('arms').get('attack') + this.related('legs').get('attack'),
            defense: this.related('head').get('defense') + this.related('body').get('defense') + this.related('arms').get('defense') + this.related('legs').get('defense'),
            agility: this.related('head').get('agility') + this.related('body').get('agility') + this.related('arms').get('agility') + this.related('legs').get('agility'),
        };
    }

});

module.exports = database.model('Robot',Robot);