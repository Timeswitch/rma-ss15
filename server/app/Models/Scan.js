/**
 * Created by janimo on 01.08.2015.
 */

var database = require('../Database.js');

var User = require('./User.js');

var Scan = database.Model.extend({
    tableName: 'scans',
    user: function(){
        return this.belongsTo(User);
    }

});

module.exports = database.model('Scan',Scan);