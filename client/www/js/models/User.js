/**
 * Created by michael on 13/08/15.
 */
define(function() {
    'use strict';

    function User(store) {

        return store.defineResource({
            name: 'User',
            relations: {
                hasOne: {
                    Robot: {
                        localField: 'robot',
                        foreignKey: 'user_id'
                    }
                },
                hasMany: {
                    Item: {
                        localField: 'inventory',
                        foreignKey: 'user_id'
                    },
                    Friend: {
                        localField: 'friends',
                        foreignKey: 'user_id'
                    }
                }
            }
        });

    };

    return User;

});