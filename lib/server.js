var get = require('request').get
var Hapi = require('hapi')
var Joi = require('joi')
var qs = require('querystring').stringify
var xml2js = require('xml2js')

var KEY = 'Er9tgfgC8ps4ikzriNr5W3x2w'
var SOURCE = 'http://realtime.ridemcts.com/bustime/api/v1'

var server = Hapi.createServer('localhost', 8000, {
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
})

module.exports = server

process
    .on('uncaughtException', stop)
    .on('SIGINT', stop)

server.route({
    path: '/get/time',
    method: 'GET',
    config: {
        handler: function (request, reply) {
            var url = [
                SOURCE,
                '/gettime?',
                qs({
                    key: KEY
                })
            ].join('')
            return getJSON(url, function(err, json){
                if (err) throw err
                return reply(json)
            })
        }
    }
})
server.route({
    path: '/get/all/vehicles/where',
    method: 'GET',
    config: {
        validate: {
            query: {
                route_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                SOURCE,
                '/getvehicles?',
                qs({
                    key: KEY,
                    tmres: 's',
                    rt: request.query['route_id']
                })
            ].join('')
            return getJSON(url, function(err, json){
                if (err) throw err
                return reply(json)
            })
        }
    }
})
server.route({
    path: '/get/vehicle/called/{vehicle_id}',
    method: 'GET',
    config: {
        validate: {
            path: {
                vehicle_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                SOURCE,
                '/getvehicles?',
                qs({
                    key: KEY,
                    tmres: 's',
                    vid: request.params['vehicle_id']
                })
            ].join('')
            return getJSON(url, function(err, json){
                if (err) throw err
                return reply(json)
            })
        }
    }
})
server.route({
    path: '/get/all/routes',
    method: 'GET',
    config: {
        handler: function (request, reply) {
            var url = [
                SOURCE,
                '/getroutes?',
                qs({
                    key: KEY
                })
            ].join('')
            return getJSON(url, function(err, json){
                if (err) throw err
                return reply(json)
            })
        }
    }
})
server.start(function(err){
    if (err) throw err
    server.emit('start')
})

function stop() {
    server.stop(function(){ process.exit(1) })
}

function getJSON(url, callback) {

    return get(url, function(err, res, body){

        if (err) return callback(err)
        return xml2js.parseString(body, function(err, json){
            if (err) return callback(err)
            return callback(null, json)
        })
    })
}
