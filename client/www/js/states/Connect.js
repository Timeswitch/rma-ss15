/**
 * Created by michael on 03/09/15.
 */
define([
    'states/BaseState'
],function(BaseState){

    function Connect(){
        BaseState.call(this);
    }

    Connect.prototype = Object.create(BaseState.prototype);
    Connect.prototype.constructor = Connect;

    Connect.prototype.init = function() {
        BaseState.prototype.init.call(this);

        this.progress = null;
        this.text = null;
    };

    Connect.prototype.create = function(){
        this.progress = this.add.sprite(this.world.centerX,this.world.centerY + 30,'progressbar');
        this.progress.animations.add('load',[0,1,2,3,4,5,6,7,8,9,10,11,12]);
        this.progress.animations.play('load',5,true);
        this.progress.alpha = 0.7;
        this.progress.tint = 0x419001;
        this.progress.scale.set(1.3,1.3);
        this.progress.anchor.set(0.5);

        this.text = this.add.text(this.world.centerX,this.world.centerY-24,'Verbinde...',{font: "26px bitwise",fill: '#ffffff',align: 'center'});
        this.text.anchor.set(0.5);

        this.app.initConnection();
    };

    Connect.prototype.enableInput = function(){
        BaseState.prototype.enableInput.call(this);
        this.text.visible = true;
        this.progress.visible = true;
    };

    Connect.prototype.disableInput = function(){
        BaseState.prototype.disableInput.call(this);
        this.text.visible = false;
        this.progress.visible = false;
    };

    Connect.prototype.shutdown = function(){
        this.closeInput();
        this.text.destroy();
        this.progress.destroy();
    };

    return new Connect();

});