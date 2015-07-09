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
            this.height = window.innerHeight * window.devicePixelRatio
        }


        App.prototype.run = function(){
            this.game = new Phaser.Game(this.width,this.height,Phaser.AUTO,'',Boot);
            console.log(this.game);
        };

        App.prototype.onResize = function(){
            var self = this;
            if(this.canvas !== null){

                this.width = window.innerWidth * window.devicePixelRatio;
                this.height = window.innerHeight * window.devicePixelRatio

                this.game.renderer.resize(this.width,this.height);
                this.game.width = this.width;
                this.game.height = this.height;
                this.game.world.setBounds(0,0,this.width,this.height);

                setTimeout(function(){
                    self.canvas.style.width = window.innerWidth + 'px !important';
                    self.canvas.style.height = window.innerHeight + 'px !important';
                },100);

            }else{
                alert('oi canvas = null!');
            }
        };

        return new App();

});


