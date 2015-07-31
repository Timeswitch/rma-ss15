/**
 * Created by michael on 28/07/15.
 */

var database = require('../Database.js');

var Robot = require('./Robot.js');

var User = database.Model.extend({
    tableName: 'user',
    robot: function(){
        return this.hasOne(Robot);
    }

});

module.exports = User;