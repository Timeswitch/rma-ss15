/**
 * Created by michael on 31/08/15.
 */

define([
    'states/BaseState'
],function(BaseState){

    function Friendlist(){
        this.app = null;
    }

    Friendlist.prototype = Object.create(BaseState.prototype);
    Friendlist.prototype.constructor = Friendlist;

    Friendlist.prototype.init = function(){
        this.app = require('app');
        this.friendInput = null;
    };

    Friendlist.prototype.create = function(){
        this.friendInput = document.createElement('input');
        this.friendInput.type = 'text';
        this.friendInput.style.width = (this.app.width - 84) + 'px';
        this.friendInput.style.height = 48 + 'px';
        this.friendInput.style.position = 'absolute';
        this.friendInput.style.bottom = '0px';
        this.friendInput.style.fontSize = '24px';
        this.friendInput.style.fontFamily = 'vt323regular';
        this.friendInput.style.color = '#ffffff';
        this.friendInput.style.backgroundColor = '#419001';
        this.friendInput.style.borderColor = '#1F4005';
        document.body.appendChild(this.friendInput);
    };

    Friendlist.prototype.shutdown = function(){
        this.friendInput.parentNode.removeChild(this.friendInput);
        this.friendInput = null;
    };

    return new Friendlist();
});