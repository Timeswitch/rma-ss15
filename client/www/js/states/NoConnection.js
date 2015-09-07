/**
 * Created by michael on 07/09/15.
 */
define([
    'states/BaseState'
],function(BaseState){

    function NoConnection(){
        BaseState.call(this);
    }

    NoConnection.prototype = Object.create(BaseState.prototype);
    NoConnection.prototype.constructor = NoConnection;

    NoConnection.prototype.init = function(){
        BaseState.prototype.init.call(this);

        this.image = null;
    };

    NoConnection.prototype.preload = function(){
        this.load.image('noConnection','assets/noConnection.png');
    };

    NoConnection.prototype.create = function(){
        this.image = this.add.sprite(this.world.centerX,this.world.centerY,'noConnection');
        this.app.scaleMax(this.image,this.app.width-80,this.app.height-80);
        this.image.anchor.set(0.5,0.5);
    };

    return new NoConnection();
});