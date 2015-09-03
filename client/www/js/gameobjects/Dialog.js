/**
 * Created by michael on 03/09/15.
 */
define([
    'gameobjects/TileBox'
],function(TileBox){

    function Dialog(game,state,title,text,callback){
        Phaser.Group.call(this,game);

        this.state = state;
        this.closed = false;
        this.callback = callback;

        this.title = new Phaser.Text(game,0,0,title,{font: "30px bitwise",fill: '#ffffff',align: 'center'});
        this.title.anchor.set(0.5);
        this.text = new Phaser.Text(game,0,0,text,{font: "22px vt323regular",fill: '#ffffff',align: 'center'});
        this.text.anchor.set(0.5);

        this.button = new Phaser.Button(game,0,0,'buttonOK',this.onButtonClick,this,0,0,1,0);
        this.button.anchor.set(0.5);

        this.boxWidth = Math.max(this.title.width,this.text.width,(this.state.app.width/2)) + 20;
        this.boxHeight = this.title.height + this.text.height + this.button.height + 40;

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

        this.button.x = (this.boxWidth/2);
        this.button.y = this.text.y + this.text.height + 15;

        this.tileBox.setAll('alpha',0.7);
        this.button.alpha = 0.7;
        this.title.alpha = 0.8;
        this.text.alpha = 0.8;


        this.add(this.tileBox);
        this.add(this.title);
        this.add(this.text);
        this.add(this.button);

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

    Dialog.prototype.onButtonClick = function(){
        this.close();
        if(this.callback){
            this.callback();
        }
    };

    return Dialog;

});