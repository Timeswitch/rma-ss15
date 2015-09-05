/**
 * Created by michael on 02/09/15.
 */
define([
    'gameobjects/TileBox'
],function(TileBox) {

    function InputDialog(game,state,message,handler){
        Phaser.Group.call(this,game);
        var self = this;

        this.state = state;
        this.closed = false;

        this.message = new Phaser.Text(game,0,0,message,{font: "24px bitwise",fill: '#ffffff',align: 'center'});
        this.boxWidth = (this.message.width+50);
        this.boxHeight = this.message.height + 100;

        this.message.x = (this.boxWidth/2);
        this.message.y = 35;
        this.message.anchor.set(0.5);


        this.tileBox = new TileBox(game,this.boxWidth,this.boxHeight);
        this.tileBox.x = 0;
        this.tileBox.y = 0;

        this.add(this.tileBox);
        this.add(this.message);

        this.x = (this.state.app.width/2) - (this.boxWidth/2);
        this.y = (this.state.app.height/2) - (this.boxHeight/2);

        this.tileBox.setAll('alpha',0.85);
        this.message.alpha = 0.85;

        this.userInput = document.createElement('input');
        this.userInput.type = 'text';
        this.userInput.style.width = (this.boxWidth-60) + 'px';
        this.userInput.style.height = 40 + 'px';
        this.userInput.style.position = 'absolute';
        this.userInput.style.top = (this.y + this.message.height + 30) + 'px';
        this.userInput.style.left = ((this.state.app.width/2) - ((this.boxWidth-60)/2)) + 'px';
        this.userInput.style.fontSize = '24px';
        this.userInput.style.fontFamily = 'vt323regular';
        this.userInput.style.color = '#ffffff';
        this.userInput.style.backgroundColor = '#419001';
        this.userInput.style.borderColor = '#1F4005';
        this.userInput.onkeyup = function(e){
            var code = e.which || e.keyCode;
            if(code == 13){
                self.onEnter();
            }
        };
        document.body.appendChild(this.userInput);

        this.keyboardListener = this.onKeyboardClose.bind(this);
        window.addEventListener('native.keyboardhide', this.keyboardListener);

        this.handler = handler;

        this.state.disableInput();

    }

    InputDialog.prototype = Object.create(Phaser.Group.prototype);
    InputDialog.prototype.constructor = InputDialog;

    InputDialog.prototype.close = function(){
        if(!this.closed){
            window.removeEventListener('native.keyboardhide', this.keyboardListener);
            this.userInput.parentNode.removeChild(this.userInput);
            this.destroy();
            this.state.enableInput();
            this.closed = true;
            this.state.closeInput();
        }

    };

    InputDialog.prototype.onKeyboardClose = function(e){
        this.userInput.blur();
    };

    InputDialog.prototype.onEnter = function(){
        if(this.handler){
            this.handler(this.userInput.value,this);
        }
    };



    return InputDialog;
});