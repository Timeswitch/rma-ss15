/**
 * Created by michael on 22/08/15.
 */
define(function() {
    'use strict';

    function Item(store) {

        return store.defineResource({
            name: 'Item',
            relations: {
                hasOne: {
                    RobotPart: {
                        localField: 'robotpart',
                        localKey: 'robotpart_id'
                    }
                }
            }
        });

    };

    return Item;

});