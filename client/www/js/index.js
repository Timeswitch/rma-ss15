/**
 * Created by michael on 05/07/15.
 */
'use strict';

requirejs.config({
    baseUrl: 'js'
});

requirejs([
    'app'

],function(App){


    document.addEventListener('deviceready',function(){
        App.run();
    });


});