/**
 * Created by michael on 26/07/15.
 */

var Promise = require('bluebird');
var database = require('./Database.js');
var RobotPart = require('./Models/RobotPart.js');

database.knex.migrate.latest().then(function(){

    var defaultItems = [];

    function newItem(name, slot, image, agility, attack, defense, effect){
        defaultItems.push(RobotPart.forge({
            name: name,
            slot: slot,
            image: image,
            agility: agility,
            attack: attack,
            defense: defense,
            effect: effect
        }).save());
    }

    //Heads
    newItem('test','head',0,0,1,1,null);

    Promise.all(defaultItems).then(function(){
        process.exit();
    });
});
