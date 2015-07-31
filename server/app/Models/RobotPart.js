/**
 * Created by michael on 31/07/15.
 */

var database = require('../Database.js');

var Robot = require('./Robot.js');

var RobotPart = database.Model.extend({
    tableName: 'robotpart'
});

module.exports = RobotPart;