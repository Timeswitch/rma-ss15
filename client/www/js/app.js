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
            this.width = window.innerWidth * window.devicePixelRatio;
            this.height = window.innerHeight * window.devicePixelRatio;
            this.ratio = window.devicePixelRatio;
        }


        App.prototype.run = function(){
            this.game = new Phaser.Game(this.width,this.height,Phaser.AUTO,'',Boot);

            console.log(this.game);
        };

        App.prototype.load = function(method,key,url){
            if(arguments.length < 3){
                throw 'invalid_call';
            }else{
                var args = [];
                args.push(key);

                if(window.devicePixelRatio > 1){
                    url = 'assets/hdpi/' + url;
                }else{
                    url = 'assets/default/' + url;
                }

                args.push(url);

                for(var i = 3; i<arguments.length;i++){
                    args.push(arguments[i]);
                }

                if(window.devicePixelRatio > 1 && method === 'spritesheet'){
                    args[3] *= 2;
                    args[4] *= 2;
                }

                this.game.load[method].apply(this.game.load,args);
            }
        };

        App.prototype.add = function(method){
            var object = this.game.add[method].apply(this.game.add,Array.prototype.splice.call(arguments,1));
            this.applyScaleTo(object);
            return object;
        };

        App.prototype.applyScaleTo = function(object){
            object.scale.setTo(this.ratio,this.ratio);
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


