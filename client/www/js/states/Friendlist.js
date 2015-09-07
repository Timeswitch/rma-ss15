/**
 * Created by michael on 31/08/15.
 */

define([
    'states/BaseState',
    'gameobjects/TileBox',
    'gameobjects/FriendlistItem'
],function(BaseState,TileBox,FriendlistItem){

    function Friendlist(){
        BaseState.call(this);
    }

    Friendlist.prototype = Object.create(BaseState.prototype);
    Friendlist.prototype.constructor = Friendlist;

    Friendlist.prototype.init = function(){
        BaseState.prototype.init.call(this);

        this.friendInput = null;
        this.friendButton = null;
        this.titleContainer = null;
        this.background = null;
        this.keyboardListener = this.onKeyboardClose.bind(this);
        this.background = null;
        this.filter = null;

        this.pointerDown = false;
        this.lastPointerY= 0;
        this.listTween = null;

        window.addEventListener('native.keyboardhide', this.keyboardListener);
    };

    Friendlist.prototype.preload = function(){
        this.load.spritesheet('buttonPlus', 'assets/spritesheets/plus.png',60,60);
    };

    Friendlist.prototype.create = function(){
        var self = this;

        this.filter = new Phaser.Filter(this.app.game, {timeN: { type: '1f', value: 0 }}, this.filterSrc);
        this.filter.setResolution(this.app.width, this.app.height);
        this.background = this.add.sprite(0,0);
        this.background.width = this.app.width;
        this.background.height = this.app.height;
        this.background.filters = [this.filter];

        this.list = this.add.group();
        this.list.x = 0;
        this.list.y = 60;
        this.initList();

        this.titleContainer = new TileBox(this.app.game,this.app.width,60);

        this.titleContainer.x = 0;
        this.titleContainer.y = 0;

        var titleText = this.app.game.add.text(this.world.centerX,30,'Freunde',{font: "35px bitwise",fill: '#ffffff',align: 'center'});
        titleText.anchor.set(0.5);
        this.titleContainer.add(titleText);
        this.titleContainer.forEach(function(e){
            e.alpha = 0.7;
        },this);

        var menuButton = this.app.game.add.text(10,2,'<',{font: "50px vt323regular",fill: '#ffffff',align: 'center'});
        this.titleContainer.add(menuButton);
        this.createOnClick(menuButton,this.onBack);

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
        this.friendInput.onkeyup = function(e){
            var code = e.which || e.keyCode;
            if(code == 13){
                self.onPlusClick();
            }
        };
        document.body.appendChild(this.friendInput);

        this.friendButton = this.add.button(this.app.width - 60, this.app.height - 60, 'buttonPlus',this.onPlusClick,this,0,0,1,0);

    };

    Friendlist.prototype.shutdown = function(){
        window.removeEventListener('native.keyboardhide', this.keyboardListener);
        this.friendInput.parentNode.removeChild(this.friendInput);
        this.friendInput = null;

        this.friendButton.destroy();
        this.titleContainer.destroy();
        this.background.destroy();
    };

    Friendlist.prototype.onPlusClick = function(){
        if(this.friendInput.value == ''){
            return;
        }
        var self = this;
        cordova.plugins.Keyboard.close();
        this.showProgress();
        this.app.connection.addFriend(this.friendInput.value,function(data){
            self.stopProgress(function(){
                self.showDialog('Info',data.code);
                self.initList();
            });
        });
        this.friendInput.value = '';
    };

    Friendlist.prototype.onKeyboardClose = function(){
        this.friendInput.blur();
    };

    Friendlist.prototype.initList = function(){
        var y = this.list.y;
        this.list.y = 0;
        this.list.removeAll(true);
        for(var i=0; i<this.app.user.friends.length;i++){
            var friend = this.app.user.friends[i];
            var item = new FriendlistItem(this.app.game,this,friend,this.onDeleteClick.bind(this),this.onBattleClick.bind(this));
            item.y = (i*56);
            this.list.add(item);
        }

        this.list.y = y;
    };

    Friendlist.prototype.update = function(){
        if(this.isInputEnabled() && this.input.activePointer.isDown) {
            if (!this.pointerDown) {
                this.lastPointerY = this.input.activePointer.y;
                this.pointerDown = true;
                if(this.listTween != null){
                    this.listTween.stop();
                }
            }

            var move = this.input.activePointer.y - this.lastPointerY;

            this.list.y += move;

            this.lastPointerY = this.input.activePointer.y;

        }

        if(this.input.activePointer.justReleased() || !this.isInputEnabled()) {
            if (this.pointerDown) {
                this.pointerDown = false;

                var isLongerThanView = (this.list.height > (this.app.height - 115));

                if(this.list.y > 60 ||  !isLongerThanView && this.list.y < 60){
                    this.listTween = this.add.tween(this.list).to({y: 60},150);
                    this.listTween.start();
                }

                if(isLongerThanView && (this.list.y + this.list.height) < (this.app.height - 55)){
                    this.listTween = this.add.tween(this.list).to({y: (this.app.height - 55 - this.list.height)},150);
                    this.listTween.start();
                }
            }
        }
    };

    Friendlist.prototype.onDeleteClick = function(id){
        if(!this.isInputEnabled()){
            return;
        }
        var self = this;
        this.showProgress();
        this.app.connection.removeFriend(id,function(){
           self.stopProgress(function(){
               self.initList();
           });
        });
    };

    Friendlist.prototype.onBattleClick = function(id){
        this.app.requestFight(id);
    };

    Friendlist.prototype.onBack = function(){
        this.app.startState('Menu');
    };

    return new Friendlist();
});