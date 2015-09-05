/**
 * Created by michael on 02/09/15.
 */

define(function(){

    function TileBox(game,innerWidth,innerHeight){
        Phaser.Group.call(this,game);

        this.innerWidth = innerWidth;
        this.innerHeight = innerHeight;

        this.texture = game.add.bitmapData(60+innerWidth,60+innerHeight);
        this.texture.fill(26,58,0);
        this.texture.rect(2,2,56+innerWidth,56+innerHeight,'#62DC00');

        this.create(0,0,this.texture);

    }

    TileBox.prototype = Object.create(Phaser.Group.prototype);
    TileBox.prototype.constructor = TileBox;

    return TileBox;

});