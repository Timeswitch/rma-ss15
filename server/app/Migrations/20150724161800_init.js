/**
 * Created by michael on 24/07/15.
 */

module.exports.up = function(knex,Promise) {
    return knex.schema.createTable('robotpart', function (table) {
        table.increments('id').primary();
        table.string('name');
        table.string('slot');
        table.string('image');
        table.integer('agility');
        table.integer('attack');
        table.integer('defense');
        table.string('effect');

    }).createTable('robot', function (table) {
        table.increments('id').primary();
        table.integer('arms').references('robotpart.slot');
        table.integer('legs').references('robotpart.slot');
        table.integer('body').references('robotpart.slot');
        table.integer('head').references('robotpart.slot');

    }).createTable('user', function (table) {
        table.increments('id').primary();
        table.string('username');
        table.uuid('logintoken');
        table.integer('wins');
        table.integer('defeats');
        table.integer('robot_id').unique().references('robot.id');

    }).createTable('inventar', function (table) {
        table.integer('user_id').references('user.id');
        table.integer('robotpart_id').references('robotpart.id');
        table.integer('count');

    }).createTable('friends', function (table) {
        table.integer('user_id').references('user.id');
        table.integer('user_id2').references('user.id');

    }).createTable('scans', function (table) {
        table.integer('user_id').references('user.id');
        table.integer('code');
        table.timestamp('lastscan');
        table.unique(['user_id', 'code']);
    });
    };

    module.exports.down = function(knex,Promise){
        return knex.schema.dropTable('robotparts')
            .dropTable('robot')
            .dropTable('user')
            .dropTable('inventar')
            .dropTable('friends')
            .dropTable('scans');
    };
