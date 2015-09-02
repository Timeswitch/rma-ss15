/**
 * Created by michael on 28/08/15.
 */
define([
    'gameobjects/ProgressDialog'
],function(ProgressDialog){
    function BaseState(){
        this.app = null;
    }

    BaseState.prototype = Object.create(Phaser.State.prototype);
    BaseState.prototype.constructor = BaseState;

    BaseState.prototype.init = function(){
        this.app = require('app');
        this.pd = null;
        this.inputEnabled = true;
        this.inputBlockCount = 0;
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

    BaseState.prototype.showProgress = function(){
        if(this.pd == null){
            this.pd = new ProgressDialog(this.app.game,this);
        }
    };

    BaseState.prototype.stopProgress = function(callback){
        if(this.pd != null){
            this.pd.dismiss(callback);
            this.pd = null;
        }
    };

    BaseState.prototype.onDataUpdate = function(){

    };

    BaseState.prototype.disableInput = function(){
        this.inputEnabled = false;
        this.inputBlockCount++;
    };

    BaseState.prototype.enableInput = function(){
        this.inputBlockCount--;

        if(this.inputBlockCount == 0){
            this.inputEnabled = true;
        }
    };

    BaseState.prototype.isInputEnabled = function(){
        return this.inputEnabled;
    };

    return BaseState;
});