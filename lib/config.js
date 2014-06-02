var config = {
    env: process.env.NODE_ENV || 'development',
    lout: {
        endpoint: '/'
    },
    mcts: {
        key: process.env.MCTS_KEY || 'Er9tgfgC8ps4ikzriNr5W3x2w',
        base_url: 'http://realtime.ridemcts.com/bustime/api/v1/'
    },
    server: {
        host: '0.0.0.0',
        port: 1*process.env.PORT || 8000,
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
    }
}

switch (config.env) {
    case 'production':
        break
    default:
        break
}

module.exports = config
