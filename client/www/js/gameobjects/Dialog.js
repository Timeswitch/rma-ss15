/**
 * Created by michael on 03/09/15.
 */
define([
    'gameobjects/TileBox'
],function(TileBox){

    function Dialog(game,state,title,text,callbackOk,callbackCancel){
        Phaser.Group.call(this,game);

        this.state = state;
        this.closed = false;
        this.callbackOk = callbackOk;
        this.callbackCancel = callbackCancel;

        this.title = new Phaser.Text(game,0,0,title,{font: "30px bitwise",fill: '#ffffff',align: 'center'});
        this.title.anchor.set(0.5);
        this.text = new Phaser.Text(game,0,0,text,{font: "22px vt323regular",fill: '#ffffff',align: 'center'});
        this.text.anchor.set(0.5);

        this.buttonOk = new Phaser.Button(game,0,0,'buttonOK',this.onButtonOkClick,this,0,0,1,0);
        this.buttonOk.anchor.set(0.5);

        this.buttonCancel = null;

        if(this.callbackCancel){
            this.buttonCancel = new Phaser.Button(game,0,0,'buttonCancel',this.onButtonCancelClick,this,0,0,1,0);
            this.buttonCancel.anchor.set(0.5);
        }

        this.boxWidth = Math.max(this.title.width,this.text.width,(this.state.app.width/2)) + 20;
        this.boxHeight = this.title.height + this.text.height + this.buttonOk.height + 40;

        this.tileBox = new TileBox(game,{
            topLeft: 'alertTL',
            topRight: 'alertTR',
            top: 'alertT',
            left: 'alertL',
            center: 'alertM',
            right: 'alertR',
            bottomLeft: 'alertBL',
            bottomRight: 'alertBR',
            bottom: 'alertB'
        },30,this.boxWidth-60,this.boxHeight-60);
        this.tileBox.x = 0;
        this.tileBox.y = 0;

        this.title.x = (this.boxWidth/2);
        this.title.y = 30;

        this.text.x = (this.boxWidth/2);
        this.text.y = this.title.y + this.title.height;

        this.buttonOk.x = (this.boxWidth/2);
        this.buttonOk.y = this.text.y + this.text.height + 15;

        if(this.buttonCancel){
            this.buttonOk.x -= this.buttonOk.width + 10;
            this.buttonCancel.x = (this.boxWidth/2) + this.buttonCancel.width;
            this.buttonOk.y = this.text.y + this.text.height + 15;
        }

        this.tileBox.setAll('alpha',0.7);
        this.buttonOk.alpha = 0.7;
        this.title.alpha = 0.8;
        this.text.alpha = 0.8;


        this.add(this.tileBox);
        this.add(this.title);
        this.add(this.text);
        this.add(this.buttonOk);
        if(this.buttonCancel){
            this.add(this.buttonCancel);
        }

        this.x = (this.state.world.centerX) - (this.boxWidth/2);
        this.y = (this.state.world.centerY) - (this.boxHeight/2);

        this.state.disableInput();

    }

    Dialog.prototype = Object.create(Phaser.Group.prototype);
    Dialog.prototype.constructor = Dialog;

    Dialog.prototype.close = function(){
        if(!this.closed){
            this.closed = true;
            this.destroy();
            this.state.enableInput();
            this.state.closeDialog();
        }
    };

    Dialog.prototype.onButtonOkClick = function(){
        this.close();
        if(this.callbackOk){
            this.callbackOk();
        }
    };

    Dialog.prototype.onButtonCancelClick = function(){
        this.close();
        this.callbackCancel();
    };

        return Dialog;

});