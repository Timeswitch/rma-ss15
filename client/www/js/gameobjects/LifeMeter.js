/**
 * Created by michael on 08/09/15.
 */
define([
    'gameobjects/TileBox'
],function(TileBox){

    var lifeTex = null;

    function LifeMeter(game,width,height,caption){
        Phaser.Group.call(this,game);

        this.boxWidth = width;
        this.boxHeight = height;
        this.caption = caption;
        this.game = game;

        this.life = 100;

        this.box = new TileBox(game,this.boxWidth,this.boxHeight);
        this.box.x = 0;
        this.box.y = 0;

        if(!lifeTex){
            lifeTex = this.game.add.bitmapData(1,1);
            lifeTex.fill(255,0,0);
        }

        this.lifeBox = this.game.add.sprite(15,this.box.height-35,lifeTex);
        this.lifeBox.height = 20;
        this.lifeBox.width = this.box.width - 30;

        this.lifeWidth = this.lifeBox.width;

        this.captionText = this.game.add.text(10,0,this.caption,{font: (this.box.height - 60)+"px vt323regular",fill: '#ffffff',align: 'left'});
        this.captionText.y = (this.lifeBox.y/2) - (this.captionText.height/2);

        this.add(this.box);
        this.add(this.lifeBox);
        this.add(this.captionText);

        this.setAll('alpha',0.8);
    }

    LifeMeter.prototype = Object.create(Phaser.Group.prototype);
    LifeMeter.prototype.constructor = LifeMeter;

    LifeMeter.prototype.setLife = function(life){
        this.life = life;

        this.lifeBox.width = this.lifeWidth * (this.life/100);
    };

    return LifeMeter;

});