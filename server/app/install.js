/**
 * Created by michael on 26/07/15.
 */

var database = require('./Database.js');

database.knex.migrate.latest();