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
                        },
                        {
                            localField: 'item',
                            localKey: 'item_id'
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
                        item: this.item,
                        db: true
                    }

                    return config;
                },
                getStats: function(){
                    return {
                        attack: ((this.head ? this.head.attack : 0) + (this.body ? this.body.attack : 0) + (this.arms ? this.arms.attack : 0) + (this.legs ? this.legs.attack : 0)),
                        defense: ((this.head ? this.head.defense : 0) + (this.body ? this.body.defense : 0) + (this.arms ? this.arms.defense : 0) + (this.legs ? this.legs.defense : 0)),
                        agility: ((this.head ? this.head.agility : 0) + (this.body ? this.body.agility : 0) + (this.arms ? this.arms.agility : 0) + (this.legs ? this.legs.agility : 0)),
                    };
                }
            }
        });

    };

    return Robot;

});