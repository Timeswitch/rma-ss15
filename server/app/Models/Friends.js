/**
 * Created by janimo on 01.08.2015.
 */

var database = require('../Database.js');

var User = require('./Robot.js');

var Friends = database.Model.extend({
    tableName: 'friends',
    user: function(){
        return this.hasMany(User);
    },
    friend: function(){
        return this.belongsToMany(User);
    }

});

module.exports = Friends;