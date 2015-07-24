/**
 * Created by michael on 05/07/15.
 */
'use strict';

requirejs.config({
    baseUrl: 'js',
    paths: {
        'socket.io': '../bower_components/socket.io-client/socket.io'
    }
});

requirejs([
    'app'

],function(App){


    document.addEventListener('deviceready',function(){
        App.run();
    });


});