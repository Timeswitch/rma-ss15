/**
 * Created by michael on 31/08/15.
 */
define(function() {
    'use strict';

    function Friend(store) {

        return store.defineResource({
            name: 'Friend'
        });

    };

    return Friend;

});