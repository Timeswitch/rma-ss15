/**
 * Created by janimo on 01.08.2015.
 */

var database = require('../Database.js');

var User = require('./User.js');

var Scans = database.Model.extend({
    tableName: 'scans',
    user: function(){
        return this.belongsToMany(User);
    }

});

module.exports = Scans;