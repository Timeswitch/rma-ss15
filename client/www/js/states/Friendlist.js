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
        this.friendButton = null;
    };

    Friendlist.prototype.preload = function(){
        this.load.spritesheet('buttonPlus', 'assets/spritesheets/plus.png',60,60);
    };

    Friendlist.prototype.create = function(){
        this.friendInput = document.createElement('input');
        this.friendInput.type = 'text';
        this.friendInput.style.width = (this.app.width - 66) + 'px';
        this.friendInput.style.height = 55 + 'px';
        this.friendInput.style.position = 'absolute';
        this.friendInput.style.bottom = '0px';
        this.friendInput.style.fontSize = '32px';
        this.friendInput.style.fontFamily = 'vt323regular';
        this.friendInput.style.color = '#ffffff';
        this.friendInput.style.backgroundColor = '#419001';
        this.friendInput.style.borderColor = '#1F4005';
        document.body.appendChild(this.friendInput);

        this.friendButton = this.add.button(this.app.width - 60, this.app.height - 60, 'buttonPlus',this.onPlusClick,this,0,0,1,0);

    };

    Friendlist.prototype.shutdown = function(){
        this.friendInput.parentNode.removeChild(this.friendInput);
        this.friendInput = null;
    };

    Friendlist.prototype.onPlusClick = function(){
        this.app.connection.addFriend(this.friendInput.value,function(data){
            alert(data.code);
        });
    };

    return new Friendlist();
});