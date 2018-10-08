'use strict';
import { initDB } from './middle/db';
import { app } from './middle/hapi';
const _services_ = require('./service'); // FIXME read service & adapt decorator

/*
app.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return 'Hello, world!';
    }
});
*/

const init = async () => {
    await app.start();
    console.log(`Server running at: ${app.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
initDB();
