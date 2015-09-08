/**
 * Created by michael on 04/09/15.
 */
define(function(){

    var boxTex = null;
    var iconBoxTex = null;

    function InventorylistItem(game,state,item){
        Phaser.Group.call(this,game);

        this.game = game;
        this.state = state;
        this.item = item;

        this.boxWidth = this.state.app.width;
        this.boxHeight = 90;

        if(!boxTex){
            boxTex = this.state.add.bitmapData(this.boxWidth,this.boxHeight);
            boxTex.fill(0,0,0);
            boxTex.rect(1,1,this.boxWidth-1,this.boxHeight-1,'#419001');
        }

        if(!iconBoxTex){
            iconBoxTex = this.state.add.bitmapData(64,64);
            iconBoxTex.fill(0,0,0);
            iconBoxTex.rect(1,1,62,62,'#419001');
        }

        this.box = this.state.add.sprite(0,0,boxTex);
        this.box.inputEnabled = true;

        var countString = ((this.item.count < 10) ? ' ' + this.item.count : this.item.count) + 'x';
        this.countText = new Phaser.Text(game,5,5,countString,{font: "28px vt323regular",fill: '#ffffff',align: 'left'});
        this.nameText = new Phaser.Text(game,this.countText.width + 10, 5, this.item.robotpart.name,{font: "28px vt323regular",fill: '#ffffff',align: 'left'});

        if(this.item.slot != 'item'){
            var attackString = 'ANGR:' + (this.item.robotpart.attack || '-');
            this.attackText = new Phaser.Text(game,5, 10 + this.countText.height, attackString,{font: "26px vt323regular",fill: '#ffffff',align: 'left'});

            var defenseString = 'VRT:' + (this.item.robotpart.defense || '-');
            this.defenseText = new Phaser.Text(game,10 + this.attackText.width, 10 + this.countText.height, defenseString,{font: "26px vt323regular",fill: '#ffffff',align: 'left'});

            var agilityString = 'BWG:' + (this.item.robotpart.agility || '-');
            this.agilityText = new Phaser.Text(game,15 + this.attackText.width + this.defenseText.width, 10 + this.countText.height, agilityString,{font: "26px vt323regular",fill: '#ffffff',align: 'left'});

        }

        this.iconContainer = this.getIcon();

        this.iconContainer.x = this.state.app.width - 69;
        this.iconContainer.y = (this.boxHeight/2) - 32;

        this.add(this.box);

        if(this.item.slot != 'item') {

            this.add(this.countText);
            this.add(this.nameText);
            this.add(this.attackText);
            this.add(this.defenseText);
            this.add(this.agilityText);
        }

        this.add(this.iconContainer);

        this.alpha = 0.7;

    };

    InventorylistItem.prototype = Object.create(Phaser.Group.prototype);
    InventorylistItem.prototype.constructor = InventorylistItem;

    InventorylistItem.prototype.getIcon = function(){
        var iconTex = this.item.robotpart.getImage();
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

        this.state.app.scaleMax(icon,60,60,true);
        icon.x = 32-(icon.width/2);
        icon.y = 32-(icon.height/2);

        var iconBox = new Phaser.Sprite(this.game,0,0,iconBoxTex);

        iconContainer.add(iconBox);
        iconContainer.add(icon);

        return iconContainer;
    };

    return InventorylistItem;

});