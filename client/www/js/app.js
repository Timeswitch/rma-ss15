/**
 * Created by michael on 23/06/15.
 */
'use strict';

define([

    'states/boot'

],function(Boot){

        function App(){
            this.game = null;
            this.canvas = null;
            this.width = window.innerWidth;// * window.devicePixelRatio;
            this.height = window.innerHeight;// * window.devicePixelRatio;
        }


        App.prototype.run = function(){
            this.game = new Phaser.Game(this.width,this.height,Phaser.AUTO,'',Boot);

            console.log(this.game);
        };

        App.prototype.scaleToScreen = function(sprite,toWith){
            var ratio;

            if(toWith === true){
                ratio = this.width / sprite.width;
                sprite.width = this.width;
                sprite.height = sprite.height * ratio;
            }else{
                ratio = this.height / sprite.height;
                sprite.height = this.height;
                sprite.width = sprite.width * ratio;
            }
        };

        App.prototype.makeRobot = function(config,back){
            var robot = this.game.add.group();
            robot.create(0,0,'robobody_1');

            return robot;
        };

        return new App();

});


