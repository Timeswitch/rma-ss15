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
                },
                hasOne: {
                    RobotPart: [
                        {
                            localField: 'head',
                            localKey: 'head_id'
                        },
                        {
                            localField: 'body',
                            localKey: 'body_id'
                        },
                        {
                            localField: 'arms',
                            localKey: 'arms_id'
                        },
                        {
                            localField: 'legs',
                            localKey: 'arms_id'
                        }
                    ]
                }
            }
        });

    };

    return Robot;

});