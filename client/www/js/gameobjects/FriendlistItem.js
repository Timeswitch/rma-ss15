/**
 * Created by michael on 03/09/15.
 */
define(function(){

    var boxTex = null;

    function FriendlistItem(game,state,friend,deleteHandler,battleHandler){
        Phaser.Group.call(this,game);

        this.state = state;
        this.friend = friend;
        this.deleteHandler = deleteHandler;
        this.battleHandler = battleHandler;
        this.boxWidth = this.state.app.width;;
        this.boxHeight = 56;

        if(!boxTex){
            boxTex = game.make.bitmapData(this.boxWidth,this.boxHeight);
            boxTex.fill(0,0,0);
            boxTex.rect(1,1,this.boxWidth-1,this.boxHeight-1,'#419001');
        }

        this.box = new Phaser.Sprite(game,0,0,boxTex);

        this.text = new Phaser.Text(game,5,(this.boxHeight/2)-12,this.friend.username,{font: "24px vt323regular",fill: '#ffffff',align: 'left'});

        this.buttonDelete = new Phaser.Button(game,0,0,'buttonDelete',this.onDeleteClick,this,0,0,1,0);
        this.buttonDelete.x = this.boxWidth - this.buttonDelete.width - 5;
        this.buttonDelete.y = (this.boxHeight/2) - (this.buttonDelete.height/2);

        this.buttonFight = new Phaser.Button(game,0,0,'buttonBattle',this.onBattleHandler,this,0,0,1,0);
        this.buttonFight.x = this.boxWidth - this.buttonFight.width - this.buttonFight.width - 10;
        this.buttonFight.y = (this.boxHeight/2) - (this.buttonFight.height/2);

        this.add(this.box);
        this.add(this.buttonDelete);
        this.add(this.buttonFight);
        this.add(this.text);

        this.alpha = 0.85;

    }

    FriendlistItem.prototype = Object.create(Phaser.Group.prototype);
    FriendlistItem.prototype.constructor = FriendlistItem;

    FriendlistItem.prototype.onDeleteClick = function(){
        if(this.deleteHandler){
            this.deleteHandler(this.friend.id);
        }
    };

    FriendlistItem.prototype.onBattleHandler = function(){
        if(this.battleHandler){
            this.battleHandler(this.friend.id);
        }
    };

    return FriendlistItem;
});