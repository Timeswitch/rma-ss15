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
        table.integer('rarity');

    }).createTable('robot', function (table) {
        table.increments('id').primary();
        table.integer('arms_id').references('robotpart.slot');
        table.integer('legs_id').references('robotpart.slot');
        table.integer('body_id').references('robotpart.slot');
        table.integer('head_id').references('robotpart.slot');
        table.integer('user_id').unique().references('user.id');

    }).createTable('user', function (table) {
        table.increments('id').primary();
        table.string('username');
        table.uuid('logintoken');
        table.integer('wins');
        table.integer('defeats');

    }).createTable('inventar', function (table) {
        table.integer('user_id').references('user.id');
        table.integer('robotpart_id').references('robotpart.id');
        table.integer('count');

    }).createTable('friends', function (table) {
        table.integer('user_id').references('user.id');
        table.integer('user_id2').references('user.id');

    }).createTable('scans', function (table) {
        table.increments('id').primary();
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
