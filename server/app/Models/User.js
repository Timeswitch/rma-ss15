/**
 * Created by michael on 28/07/15.
 */

var database = require('../Database.js');

var User = database.Model.extend({
    tableName: 'user'
});

module.exports = User;