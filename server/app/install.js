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
    newItem('Blueslayer Head','head',0,8,0,2,0,1);
    newItem('Jester Head','head',1,1,0,3,0,0);
    newItem('Spacebuster','head',2,1,0,9,0,0);
    newItem('Arandroid','head',3,5,0,5,0,2);
    newItem('Steele Man Head','head',4,5,0,5,0,2);
    newItem('Flexer Head','head',5,10,0,6,0,1);
    newItem('D7353 Head','head',6,3,0,8,0,0);
    newItem('Chappy Head','head',7,1,0,0);
    newItem('Chum Bucket Head','head',8,1,0,5,0,0);
    newItem('Norton Head','head',9,10,0,10,0,2);
    newItem('Unknown 51 Head','head',10,5,0,4,0,1);
    newItem('Zyklo Head','head',11,8,0,3,0,0);
    newItem('Batbot Head','head',12,2,0,5,0,1);

    //Bodies
    //newItem('Test Body','body',0,0,0,0,null);
    newItem('Blueslayer Body','body',0,3,5,4,0,1);
    newItem('Jester Body','body',1,6,5,8,0,0);
    newItem('Spacebuster Body','body',2,6,5,3,0,0);
    newItem('Arandroid Body','body',3,1,5,8,0,2);
    newItem('Steele Man Body','body',4,10,5,5,0,2);
    newItem('Flexer Body','body',5,9,5,2,0,1);
    newItem('D7353 Body','body',6,6,5,5,0,0);
    newItem('Chappy Body','body',7,1,5,0);
    newItem('Chum Bucket Body','body',8,8,5,7,0,0);
    newItem('Norton Body','body',9,10,5,10,0,2);
    newItem('Unknown 51 Body','body',10,5,5,7,0,1);
    newItem('Zyklo Body','body',11,8,5,6,0,0);
    newItem('Batbot Body','body',12,9,5,6,0,1);

    //Arms
    //newItem('Test Arms','arms',0,0,0,0,null);
    newItem('Blueslayer Arms','arms',0,1,5,1,0,1);
    newItem('Jester Arms','arms',1,5,7,5,0,0);
    newItem('Spacebuster Arms','arms',2,10,2,6,0,0);
    newItem('Arandroid Arms','arms',3,7,9,2,0,2);
    newItem('Steele Man Arms','arms',4,5,10,5,0,2);
    newItem('Flexer Arms','arms',5,4,4,9,0,1);
    newItem('D7353 Arms','arms',6,7,1,4,0,0);
    newItem('Chappy Arms','arms',7,1,3,0);
    newItem('Chum Bucket Arms','arms',8,9,6,2,0,0);
    newItem('Norton Arms','arms',9,10,10,10,0,2);
    newItem('Unknown 51 Arms','arms',10,9,8,8,0,1);
    newItem('Zyklo Arms','arms',11,6,2,7,0,0);
    newItem('Batbot Arms','arms',12,5,6,9,0,1);

    //Legs
    //newItem('Test Legs','legs',0,0,0,0,null);
    newItem('Blueslayer Legs','legs',0,2,0,2,0,1);
    newItem('Jester Legs','legs',1,4,0,4,0,0);
    newItem('Spacebuster Legs','legs',2,8,0,8,0,0);
    newItem('Arandroid Legs','legs',3,1,0,3,0,2);
    newItem('Steele Man Legs','legs',4,2,0,7,0,2);
    newItem('Flexer Legs','legs',5,1,0,5,0,1);
    newItem('D7353 Legs','legs',6,7,0,7,0,0);
    newItem('Chappy Legs','legs',7,1,0,1,0,0);
    newItem('Chum Bucket Legs','legs',8,4,0,2,0,0);
    newItem('Norton Legs','legs',9,10,0,10,0,2);
    newItem('Unknown 51 Legs','legs',10,8,0,4,0,1);
    newItem('Zyklo Legs','legs',11,9,0,3,0,0);
    newItem('Batbot Legs','legs',12,8,0,10,0,1);

    Promise.all(defaultItems).then(function(){
        process.exit();
    });
});
