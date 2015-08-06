/**
 * Created by janimo on 01.08.2015.
 */

var database = require('../Database.js');

var User = require('./User.js');

var RobotPart = require('./RobotPart.js');

var Inventory = database.Model.extend({
    tableName: 'inventory',
    user: function(){
        return this.belongsTo(User);
    },
    robotpart: function(){
        return this.hasMany(RobotPart);
    }

});

module.exports = Inventory;