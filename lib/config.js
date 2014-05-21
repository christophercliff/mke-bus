var config = {
    env: process.env.NODE_ENV,
    server: {
        host: 'localhost',
        port: 8000,
        options: {
            cors: true,
            security: {
                hsts: true
            },
            state: {
                cookies: {
                    parse: false
                }
            },
            timeout: {
                server: 10e3,
                client: 10e3
            }
        }
    },
    mcts: {
        key: 'Er9tgfgC8ps4ikzriNr5W3x2w',
        base_url: 'http://realtime.ridemcts.com/bustime/api/v1/'
    }
}

switch (config.env) {
    case 'production':
        break
    default:
        break
}

module.exports = config
