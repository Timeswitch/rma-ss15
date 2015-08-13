/**
 * Created by michael on 13/08/15.
 */
define(function() {
    'use strict';

    function Robot(store) {

        return store.defineResource({
            name: 'Robot',
            relations: {
                belongsTo: {
                    User: {
                        localField: 'user',
                        localKey: 'user_id'
                    }
                }
            }
        });

    };

    return Robot;

});