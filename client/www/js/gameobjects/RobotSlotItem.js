/**
 * Created by michael on 06/09/15.
 */
define(function(){

    var boxTex = null;
    var iconBoxTex = null;

    function RobotSlotItem(game,state,item,width){
        Phaser.Group.call(this,game);

        this.item = item;
        this.state = state;
        this.boxWidth = width;
        this.boxHeight = 40;

        if(!boxTex){
            boxTex = this.state.add.bitmapData(this.boxWidth,this.boxHeight);
            boxTex.fill(0,0,0);
            boxTex.rect(1,1,this.boxWidth-2,this.boxHeight-2,'#419001');
        }

        if(!iconBoxTex){
            iconBoxTex = this.state.add.bitmapData(30,30);
            iconBoxTex.fill(0,0,0);
            iconBoxTex.rect(1,1,28,28,'#419001');
        }

        this.box = this.state.add.sprite(0,0,boxTex);
        this.box.inputEnabled = true;

        this.iconBox = this.getIcon();

        this.iconBox.y = (this.boxHeight/2) - (this.iconBox.height/2);
        this.iconBox.x = this.iconBox.y;

        this.infoText = this.state.add.text(this.iconBox.x + 35,(this.boxHeight/2) - 5,'',{font: "20px vt323regular",fill: '#ffffff',align: 'left'});
        this.initText();

        this.add(this.box);
        this.add(this.iconBox);
        this.add(this.infoText);
    }

    RobotSlotItem.prototype = Object.create(Phaser.Group.prototype);
    RobotSlotItem.prototype.constructor = RobotSlotItem;

    RobotSlotItem.prototype.setItem = function(item){
        this.item = item;
        var icon = this.getIcon();

        icon.x = this.iconBox.x;
        icon.y = this.iconBox.y;

        this.iconBox.destroy();
        this.iconBox = icon;
        this.add(this.iconBox);

        this.initText();
    };

    RobotSlotItem.prototype.initText = function(){
        this.infoText.setText('A:' + this.item.attack + ' V:' + this.item.defense + ' B:' + this.item.agility);
    };

    RobotSlotItem.prototype.getIcon = function(){
        var iconTex = this.item.getImage();
        var iconContainer = new Phaser.Group(this.game);
        iconContainer.x = 0;
        iconContainer.y = 0;

        var icon = null;

        if(typeof(iconTex) === 'string'){
            icon = new Phaser.Sprite(this.game,0,0,iconTex);
        }else{
            icon = new Phaser.Group(this.game);
            var left = new Phaser.Sprite(this.game,0,0,iconTex.left);
            var right = new Phaser.Sprite(this.game,left.width,0,iconTex.right);

            icon.add(left);
            icon.add(right);
        }

        this.state.app.scaleMax(icon,30,30,true);
        icon.x = 15-(icon.width/2);
        icon.y = 15-(icon.height/2);

        var iconBox = new Phaser.Sprite(this.game,0,0,iconBoxTex);

        iconContainer.add(iconBox);
        iconContainer.add(icon);

        return iconContainer;
    };



    return RobotSlotItem;

});