/**
 * Created by michael on 26/07/15.
 */

var Promise = require('bluebird');
var database = require('./Database.js');
var RobotPart = require('./Models/RobotPart.js');

database.knex.migrate.latest().then(function(){

    var defaultItems = [];

    function newItem(name, slot, image, agility, attack, defense, effect, rarity){
        defaultItems.push(RobotPart.forge({
            name: name,
            slot: slot,
            image: image,
            agility: agility,
            attack: attack,
            defense: defense,
            effect: effect,
            rarity: rarity
        }).save());
    }

    //Heads
    //newItem('Test Head','head',0,0,0,0,null);
    newItem('Blueslayer Kopf','head',0,8,0,2,0,1);
    newItem('Jester Kopf','head',1,1,0,3,0,0);
    newItem('Spacebuster Kopf','head',2,1,0,9,0,0);
    newItem('Arandroid Kopf','head',3,5,0,5,0,2);
    newItem('Steele Man Kopf','head',4,5,0,5,0,2);
    newItem('Flexer Kopf','head',5,10,0,6,0,1);
    newItem('D7353 Kopf','head',6,3,0,8,0,0);
    newItem('Chappy Kopf','head',7,1,0,0);
    newItem('Chum Bucket Kopf','head',8,1,0,5,0,0);
    newItem('Norton Kopf','head',9,10,0,10,0,2);
    newItem('Unknown 51 Kopf','head',10,5,0,4,0,1);
    newItem('Zyklo Kopf','head',11,8,0,3,0,0);
    newItem('Batbot Kopf','head',12,2,0,5,0,1);

    //Bodies
    //newItem('Test Body','body',0,0,0,0,null);
    newItem('Blueslayer Torso','body',0,3,5,4,0,1);
    newItem('Jester Torso','body',1,6,5,8,0,0);
    newItem('Spacebuster Torso','body',2,6,5,3,0,0);
    newItem('Arandroid Torso','body',3,1,5,8,0,2);
    newItem('Steele Man Torso','body',4,10,5,5,0,2);
    newItem('Flexer Torso','body',5,9,5,2,0,1);
    newItem('D7353 Torso','body',6,6,5,5,0,0);
    newItem('Chappy Torso','body',7,1,5,0);
    newItem('Chum Bucket Torso','body',8,8,5,7,0,0);
    newItem('Norton Torso','body',9,10,5,10,0,2);
    newItem('Unknown 51 Torso','body',10,5,5,7,0,1);
    newItem('Zyklo Torso','body',11,8,5,6,0,0);
    newItem('Batbot Torso','body',12,9,5,6,0,1);

    //Arms
    //newItem('Test Arms','arms',0,0,0,0,null);
    newItem('Blueslayer Arme','arms',0,1,5,1,0,1);
    newItem('Jester Arme','arms',1,5,7,5,0,0);
    newItem('Spacebuster Arme','arms',2,10,2,6,0,0);
    newItem('Arandroid Arme','arms',3,7,9,2,0,2);
    newItem('Steele Man Arme','arms',4,5,10,5,0,2);
    newItem('Flexer Arme','arms',5,4,4,9,0,1);
    newItem('D7353 Arme','arms',6,7,1,4,0,0);
    newItem('Chappy Arme','arms',7,1,3,0);
    newItem('Chum Bucket Arme','arms',8,9,6,2,0,0);
    newItem('Norton Arme','arms',9,10,10,10,0,2);
    newItem('Unknown 51 Arme','arms',10,9,8,8,0,1);
    newItem('Zyklo Arme','arms',11,6,2,7,0,0);
    newItem('Batbot Arme','arms',12,5,6,9,0,1);

    //Legs
    //newItem('Test Legs','legs',0,0,0,0,null);
    newItem('Blueslayer Beine','legs',0,2,0,2,0,1);
    newItem('Jester Beine','legs',1,4,0,4,0,0);
    newItem('Spacebuster Beine','legs',2,8,0,8,0,0);
    newItem('Arandroid Beine','legs',3,1,0,3,0,2);
    newItem('Steele Man Beine','legs',4,2,0,7,0,2);
    newItem('Flexer Beine','legs',5,1,0,5,0,1);
    newItem('D7353 Beine','legs',6,7,0,7,0,0);
    newItem('Chappy Beine','legs',7,1,0,1,0,0);
    newItem('Chum Bucket Beine','legs',8,4,0,2,0,0);
    newItem('Norton Beine','legs',9,10,0,10,0,2);
    newItem('Unknown 51 Beine','legs',10,8,0,4,0,1);
    newItem('Zyklo Beine','legs',11,9,0,3,0,0);
    newItem('Batbot Beine','legs',12,8,0,10,0,1);

    Promise.all(defaultItems).then(function(){
        process.exit();
    });
});
