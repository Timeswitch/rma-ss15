/**
 * Created by michael on 28/08/15.
 */
define(function(){
    function BaseState(){
        this.app = null;
    }

    BaseState.prototype = Object.create(Phaser.State.prototype);
    BaseState.prototype.constructor = BaseState;

    BaseState.prototype.init = function(){
        this.app = require('app');
    };

    BaseState.prototype.createOnClick = function(object,handler){
        object.inputEnabled = true;
        if(!object.clickHandlers){
            object.clickHandlers = [];
            object.events.onInputDown.add(function(){
                object.alpha = 0.2;
                object.lastPos = {
                    x: this.input.activePointer.x,
                    y: this.input.activePointer.y
                };
            },this);
            object.events.onInputUp.add(function(){
                object.alpha = 0.5;
                if(Math.abs(this.input.activePointer.x-object.lastPos.x) <= 5 && Math.abs(this.input.activePointer.y-object.lastPos.y) <= 5){
                    for(var i=0; i<object.clickHandlers.length;i++){
                        object.clickHandlers[i].call(this);
                    }
                }
            },this);
        }

        object.clickHandlers.push(handler);
    };

    return BaseState;
});