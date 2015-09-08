/**
 * Created by michael on 02/09/15.
 */
define([
    'gameobjects/TileBox'
],function(TileBox){

    function ProgressDialog(game,state,cancelCallback){
        Phaser.Group.call(this,game);

        this.state = state;
        this.boxWidth = (state.app.width * 0.7);
        this.boxHeight = 120;
        this.dismissCallback = null;
        this.cancelCallback = cancelCallback;

        if(this.cancelCallback){
            this.boxHeight += 50;
        }


        this.tileBox = new TileBox(game,this.boxWidth,this.boxHeight);
        this.message = new Phaser.Text(game,0,0,'Lade...',{font: "24px bitwise",fill: '#ffffff',align: 'center'});
        this.message.x = (this.boxWidth/2);
        this.message.y = 35;
        this.message.anchor.set(0.5);

        this.add(this.tileBox);
        this.add(this.message);

        this.progress = this.create((this.boxWidth/2)-60,50,'progressbar');
        this.animation = this.progress.animations.add('load',[0,1,2,3,4,5,6,7,8,9,10,11,12]);
        this.animation.onComplete.add(this.animationStopped,this);
        this.progress.animations.play('load',5,true);
        this.progress.tint = 0x419001;

        this.x = this.state.world.centerX - (this.boxWidth/2);
        this.y = this.state.world.centerY - (this.boxHeight/2);

        this.tileBox.setAll('alpha',0.85);
        this.message.alpha = 0.85;
        this.progress.alpha = 0.85;

        this.buttonCancel = null;

        if(this.cancelCallback){
            this.buttonCancel = this.state.add.button((this.boxWidth/2) - 42 ,this.boxHeight - 45,'buttonCancel',this.onButtonCancelClick,this,0,0,1,0);
        }

        this.state.disableInput();
        navigator.vibrate(100);
    }

    ProgressDialog.prototype = Object.create(Phaser.Group.prototype);
    ProgressDialog.prototype.constructor = ProgressDialog;

    ProgressDialog.prototype.dismiss = function(callback){
        this.dismissCallback = callback;
        this.animation.loop = false;
    };

    ProgressDialog.prototype.animationStopped = function(sprite,animation){
        var self = this;
        setTimeout(function(){
            self._dismiss();

        },100);
    };

    ProgressDialog.prototype._dismiss = function(){
        this.destroy();
        this.state.enableInput();
        if(this.dismissCallback){
            this.dismissCallback();
        }
    };

    ProgressDialog.prototype.onButtonCancelClick = function(){
        var self = this;
        this.dismiss(function(){
            self.cancelCallback();
        });
    };

    return ProgressDialog;

});