/**
 * Created by michael on 26/07/15.
 */

var Knex = require('knex');
var Bookshelf = require('bookshelf');

function Database(config){
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
            tableName: 'knex_migrations'
        }
    });

    return Bookshelf(connection);
}

module.exports = Database;