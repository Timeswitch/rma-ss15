/**
 * Created by michael on 02/09/15.
 */
define([
    'gameobjects/TileBox'
],function(TileBox){

    function ProgressDialog(game,state){
        Phaser.Group.call(this,game);

        this.state = state;
        this.boxWidth = (state.app.width * 0.7);
        this.boxHeight = 120;

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
        this.messageRender = new Phaser.Text(game,0,0,'Lade...',{font: "24px bitwise",fill: '#ffffff',align: 'center'});
        this.messageRender.x = (this.boxWidth/2);
        this.messageRender.y = 35;
        this.messageRender.anchor.set(0.5);

        this.add(this.tileBox);
        this.add(this.messageRender);

        this.progress = this.create((this.boxWidth/2)-60,50,'progressbar');
        this.progress.animations.add('load',[0,1,2,3,4,5,6,7,8,9,10,11]);
        this.progress.animations.play('load',5,true);
        this.progress.tint = 0x419001;

        this.x = this.state.world.centerX - (this.boxWidth/2);
        this.y = this.state.world.centerY - (this.boxHeight/2);

        this.tileBox.setAll('alpha',0.7);
        this.messageRender.alpha = 0.8;
        this.progress.alpha = 0.7;

        this.state.disableInput();
    }

    ProgressDialog.prototype = Object.create(Phaser.Group.prototype);
    ProgressDialog.prototype.constructor = ProgressDialog;

    ProgressDialog.prototype.dismiss = function(){
        this.state.enableInput();
        this.destroy();
    };

    return ProgressDialog;

});