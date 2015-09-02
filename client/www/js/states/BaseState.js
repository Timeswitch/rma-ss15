/**
 * Created by michael on 28/08/15.
 */
define([
    'gameobjects/ProgressDialog'
],function(ProgressDialog){
    function BaseState(){
        this.app = null;
        this.filterSrc = [

            "precision mediump float;",

            "uniform float     timeN;",
            "uniform vec2      resolution;",

            "void main( void ) {",

            "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
            "float pos = (gl_FragCoord.y / resolution.y);",

            "float c = sin(pos * 400.0) * 0.4 + 0.4;",
            "c = pow(c, 0.2);",
            "c *= 0.2;",

            "float band_pos = fract(timeN * 0.1) * 3.0 - 1.0;",
            "c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;",

            "gl_FragColor = vec4( 0.0, c, 0.0, 1.0 );",
            "}"
        ];
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