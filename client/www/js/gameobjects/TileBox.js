/**
 * Created by michael on 02/09/15.
 */

define(function(){

    function TileBox(game,tiles,tilesSize,innerWidth,innerHeight){
        this.tiles = tiles;
        this.tileSize = tilesSize;
        this.innerWidth = innerWidth;
        this.innerHeight = innerHeight;

        Phaser.Group.call(this,game);

        this.create(0,0,this.tiles.topLeft);
        this.create(this.tileSize+this.innerWidth,0,this.tiles.topRight);
        this.create(0,this.tileSize+this.innerHeight,this.tiles.bottomLeft);
        this.create(this.tileSize+this.innerWidth,this.tileSize+this.innerHeight,this.tiles.bottomRight);

        this.add(new Phaser.TileSprite(game,this.tileSize,0,this.innerWidth,this.tileSize,this.tiles.top));
        this.add(new Phaser.TileSprite(game,this.tileSize,this.tileSize+this.innerHeight,this.innerWidth,this.tileSize,this.tiles.bottom));

        if(this.innerHeight > 0){
            this.add(new Phaser.TileSprite(game,0,this.tileSize,this.tileSize,this.innerHeight,this.tiles.left));
            this.add(new Phaser.TileSprite(game,this.tileSize+this.innerWidth,this.tileSize,this.tileSize,this.innerHeight,this.tiles.right));
            this.add(new Phaser.TileSprite(game,this.tileSize,this.tileSize,this.innerWidth,this.innerHeight,this.tiles.center));
        }


    }

    TileBox.prototype = Object.create(Phaser.Group.prototype);
    TileBox.prototype.constructor = TileBox;

    return TileBox;

});