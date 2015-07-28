/**
 * Created by michael on 26/07/15.
 */

var config = require('./config.js').database;
var Knex = require('knex');
var Bookshelf = require('bookshelf');

var connection = Knex({
    client: config.driver,
    connection: {
        host: config.server + ':' + config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        filename: config.filename
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: 'app/Migrations'
    }
});

module.exports = Bookshelf(connection);