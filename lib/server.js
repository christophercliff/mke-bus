var _ = require('underscore')
var Boom = require('boom')
var Hapi = require('hapi')
var Joi = require('joi')
var moment = require('moment')
var proxy = require('./proxy')
var qs = require('querystring').stringify

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
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('time', getTimeData(data)))
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
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('vehicles', getAllVehiclesData(data)))
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
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('vehicle', getVehicleData(data)))
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
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('routes', getAllRoutesData(data)))
            })
        }
    }
})

server.route({
    path: '/get/all/directions/where',
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
                '/getdirections?',
                qs({
                    key: KEY,
                    rt: request.query['route_id']
                })
            ].join('')
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('directions', getAllDirectionsData(data)))
            })
        }
    }
})

server.route({
    path: '/get/all/stops/where',
    method: 'GET',
    config: {
        validate: {
            query: {
                route_id: Joi.string().required(),
                direction: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                SOURCE,
                '/getstops?',
                qs({
                    key: KEY,
                    rt: request.query['route_id'],
                    dir: request.query['direction']
                })
            ].join('')
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('stops', getAllStopsData(data)))
            })
        }
    }
})

server.ext('onPreResponse', function (request, reply) {
    var res = request.response
    if (!res.isBoom) return reply()
    return reply(getHapiFailureResponse(res.output.statusCode, res.output.payload.message))
        .code(res.output.statusCode)
})

server.start(function(err){
    if (err) throw err
    server.emit('start')
})

function stop(err) {
    if (err instanceof Error) console.error(err.stack)
    server.stop(function(){ process.exit(1) })
}

function getTimeData(data) {
    return convertTime(data)
}

function getAllVehiclesData(data) {
    return _.map(data.vehicle, convertVehicle)
}

function getVehicleData(data) {
    return convertVehicle(data.vehicle[0])
}

function getAllRoutesData(data) {
    return _.map(data.route, convertRoute)
}

function getAllDirectionsData(data) {
    return data.dir
}

function getAllStopsData(data) {
    return _.map(data.stop, convertStop)
}

function formatDate(original) {
    return moment(original, 'YYYYMMDD HH:mm:ss').utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
}

function convertTime(original) {
    return {
        value: formatDate(original['tm'])
    }
}

function convertVehicle(original) {
    return {
        id: original['vid'][0],
        last_updated: formatDate(original['tmstmp'][0]),
        latitude: 1*original['lat'][0],
        longitude: 1*original['lon'][0],
        heading: 1*original['hdg'][0],
        pattern_id: 1*original['pid'][0],
        pattern_distance: 1*original['pdist'][0],
        route_id: original['rt'][0],
        destination: original['des'][0],
        is_delayed: original['dly'] ? original['dly'][0] : false,
        speed: 1*original['spd'][0],
        ta_block_id: original['tablockid'][0],
        ta_trip_id: original['tatripid'][0],
        zone: original['zone'][0].length > 0 ? original['zone'][0] : null
    }
}

function convertRoute(original) {
    return {
        id: original['rt'][0],
        name: original['rtnm'][0],
        color: original['rtclr'][0]
    }
}

function convertStop(original) {
    return {
        id: original['stpid'][0],
        name: original['stpnm'][0],
        latitude: 1*original['lat'][0],
        longitude: 1*original['lon'][0]
    }
}

function getHapiSuccessResponse(resourceType, data) {
    return {
        'this': 'succeeded',
        'by': 'getting',
        'the': resourceType,
        'with': data
    }
}

function getHapiFailureResponse(statusCode, message) {
    return {
        'this': 'failed',
        'with': statusCode,
        'because': message
    }
}
