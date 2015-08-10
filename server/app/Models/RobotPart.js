/**
 * Created by michael on 31/07/15.
 */

var database = require('../Database.js');

var RobotPart = null;

try{
    RobotPart = database.model('RobotPart',{
        tableName: 'robotpart'
    });
}catch(e){
    RobotPart = database._models['RobotPart'];
}

module.exports = RobotPart;