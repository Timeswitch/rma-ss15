/**
 * Created by michael on 24/07/15.
 */

define(['socket.io'],function(io){

    function ConnectionController(server){
        this.socket = io(server);

        this.socket.on('welcome',function(data){
            alert('Verbunden!');
        });
    }


    return ConnectionController;
});