/**
 * Created by michael on 31/08/15.
 */

define([
    'states/BaseState',
    'gameobjects/TileBox'
],function(BaseState,TileBox){

    function Friendlist(){
        this.app = null;
    }

    Friendlist.prototype = Object.create(BaseState.prototype);
    Friendlist.prototype.constructor = Friendlist;

    Friendlist.prototype.init = function(){
        this.app = require('app');
        this.friendInput = null;
        this.friendButton = null;
        this.titleContainer = null;
    };

    Friendlist.prototype.preload = function(){
        this.load.spritesheet('buttonPlus', 'assets/spritesheets/plus.png',60,60);
    };

    Friendlist.prototype.create = function(){

        this.titleContainer = new TileBox(this.app.game,{
            topLeft: 'alertTL',
            topRight: 'alertTR',
            top: 'alertT',
            left: 'alertL',
            center: 'alertM',
            right: 'alertR',
            bottomLeft: 'alertBL',
            bottomRight: 'alertBR',
            bottom: 'alertB'
        },30,this.app.width-60,0);

        this.titleContainer.x = 0;
        this.titleContainer.y = 0;

        var titleText = this.app.game.add.text(this.world.centerX,30,'Freunde',{font: "35px bitwise",fill: '#ffffff',align: 'center'});
        titleText.anchor.set(0.5);
        this.titleContainer.add(titleText);
        this.titleContainer.forEach(function(e){
            e.alpha = 0.7;
        },this);

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

        this.friendButton.destroy();
        this.titleContainer.destroy();
    };

    Friendlist.prototype.onPlusClick = function(){
        var self = this;
        this.showProgress();
        this.app.connection.addFriend(this.friendInput.value,function(data){
            self.stopProgress();
            alert(data.code);
        });
    };

    return new Friendlist();
});