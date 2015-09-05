/**
 * Created by michael on 02/09/15.
 */

define(function(){

    function TileBox(game,width,height){
        Phaser.Group.call(this,game);

        this.boxWidth = width || 4;
        this.boxHeight = height || 4;

        this.texture = game.add.bitmapData(this.boxWidth,this.boxHeight);
        this.texture.fill(26,58,0);
        this.texture.rect(2,2,this.boxWidth-4,this.boxHeight-4,'#62DC00');

        this.create(0,0,this.texture);

    }

    TileBox.prototype = Object.create(Phaser.Group.prototype);
    TileBox.prototype.constructor = TileBox;

    return TileBox;

});