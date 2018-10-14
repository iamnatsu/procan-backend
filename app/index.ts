'use strict';
import { initDB } from './middle/db';
import { app } from './middle/hapi';
import { Request } from 'hapi';

const _services_ = require('./service'); // read service & adapt decorator
const AuthBearer = require('hapi-auth-bearer-token');

function ignoreAuth(request: Request) {
    return (request.path === '/auth' && request.method === 'post') ||
    (request.path === '/auth' && request.method === 'get') ||
    (request.path === '/auth' && request.method === 'delete') ||
    (request.path === '/regist' && request.method === 'post');
}

const init = async () => {
    await app.register(AuthBearer)

    app.auth.strategy('simple', 'bearer-access-token', {
        validate: async (request: Request, token, h) => {
            const credentials = {};
            const artifacts = {};
            if (ignoreAuth(request) && request.params) {
                const isValid = true;
                return { isValid, credentials, artifacts };
            } else {
                const isValid = false;
                return { isValid, credentials, artifacts };
            }
        },
        allowChaining: true
    });

    app.auth.strategy('fallback', 'bearer-access-token', {
        validate: async (request, token, h) => {
            const isValid = true; //token === '1234';

            const credentials = { token };
            const artifacts = { test: 'info' };

            return { isValid, credentials, artifacts };
        },
        allowChaining: true
    });

    app.auth.default({
        strategies: [
            'simple',
            'fallback'
        ]
    });

    app.auth.scheme

    app.route({
        method: 'GET',
        path: '/',
        handler: async function (request, h) {

            return { info: 'success!' };
        }
    });

    await app.start();
    console.log(`Server running at: ${app.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
initDB();
