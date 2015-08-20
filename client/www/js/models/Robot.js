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
                            localKey: 'legs_id'
                        }
                    ]
                }
            },
            methods:{
                getConfig: function(){
                    var config = {
                        head: this.head,
                        body: this.body,
                        arms: this.arms,
                        legs: this.legs,
                        db: true
                    }

                    return config;
                }
            }
        });

    };

    return Robot;

});