/**
 * Created by michael on 12/08/15.
 */
define(function() {
    'use strict';

    function RobotPart(store) {

        return store.defineResource({
            name: 'RobotPart'
        });

    };

    return RobotPart;

});