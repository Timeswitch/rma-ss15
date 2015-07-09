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
                    url = 'hdpi/' + url;
                }

                url = 'assets/' + url;

                args.push(url);

                for(var i = 3; i<arguments.length;i++){
                    args.push(arguments[i]);
                }

                this.game.load[method].apply(this.game.load,args);
            }
        };

        return new App();

});


