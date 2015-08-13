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
            },
            methods:{
                getConfig: function(){
                    var config = {
                        head: this.head.image,
                        body: this.body.image,
                        arms: this.arms.image,
                        legs: this.legs.image
                    }

                    return config;
                }
            }
        });

    };

    return Robot;

});