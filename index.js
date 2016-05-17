'use strict';

var express = require('express');
var kraken = require('kraken-js');
var mongoose = require('mongoose');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {

        var databaseConfig = config.get('databaseConfig');
        console.log('MongoDb URL:' +  databaseConfig.mongoDbUrl);
        console.log('MongoDb dbName:' +  databaseConfig.dbName);

        var dbConnectionString = databaseConfig.mongoDbUrl + databaseConfig.dbName;

        mongoose.connect(dbConnectionString);

        var database = mongoose.connection;

        database.on('error', function (error) {
            console.error(error);
        });

        database.once('open', function callback() {
            console.log('db connection open');
        });

        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));
app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});
