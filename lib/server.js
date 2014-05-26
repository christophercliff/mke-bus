var _ = require('underscore')
var Boom = require('boom')
var config = require('./config')
var get = require('request').get
var Hapi = require('hapi')
var Joi = require('joi')
var moment = require('moment')
var proxy = require('./proxy')
var qs = require('querystring').stringify

var server = Hapi.createServer.apply(Hapi, _.toArray(config.server))

module.exports = server

process
    .on('uncaughtException', stop)
    .on('SIGINT', stop)

server.route({
    path: '/get/health',
    method: 'GET',
    config: {
        jsonp: 'callback',
        handler: function (request, reply) {
            return reply(getHapiSuccessResponse('health', {
                memory: process.memoryUsage(),
                uptime: process.uptime()
            }))
        }
    }
})

server.route({
    path: '/get/time',
    method: 'GET',
    config: {
        jsonp: 'callback',
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'gettime',
                '?',
                qs({
                    key: config.mcts.key
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
        jsonp: 'callback',
        validate: {
            query: {
                route_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getvehicles',
                '?',
                qs({
                    key: config.mcts.key,
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
        jsonp: 'callback',
        validate: {
            params: {
                vehicle_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getvehicles',
                '?',
                qs({
                    key: config.mcts.key,
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
        jsonp: 'callback',
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getroutes',
                '?',
                qs({
                    key: config.mcts.key
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
        jsonp: 'callback',
        validate: {
            query: {
                route_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getdirections',
                '?',
                qs({
                    key: config.mcts.key,
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
        jsonp: 'callback',
        validate: {
            query: {
                route_id: Joi.string().required(),
                direction: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getstops',
                '?',
                qs({
                    key: config.mcts.key,
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

server.route({
    path: '/get/all/patterns/where',
    method: 'GET',
    config: {
        jsonp: 'callback',
        validate: {
            query: {
                route_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getpatterns',
                '?',
                qs({
                    key: config.mcts.key,
                    rt: request.query['route_id']
                })
            ].join('')
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('patterns', getAllPatternsData(data)))
            })
        }
    }
})

server.route({
    path: '/get/pattern/called/{pattern_id}',
    method: 'GET',
    config: {
        jsonp: 'callback',
        validate: {
            params: {
                pattern_id: Joi.string().required()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getpatterns',
                '?',
                qs({
                    key: config.mcts.key,
                    pid: request.params['pattern_id']
                })
            ].join('')
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('pattern', getPatternData(data)))
            })
        }
    }
})

server.route({
    path: '/get/all/predictions/where',
    method: 'GET',
    config: {
        jsonp: 'callback',
        validate: {
            query: {
                stop_id: Joi.string().required(),
                route_id: Joi.string().optional(),
                take: Joi.number().optional().integer().min(1).max(5)
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getpredictions',
                '?',
                qs({
                    key: config.mcts.key,
                    stpid: request.query['stop_id'],
                    rt: request.query['route_id'],
                    top: request.query['take']
                })
            ].join('')
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('predictions', getAllPredictionsData(data)))
            })
        }
    }
})

server.route({
    path: '/get/all/alerts/where',
    method: 'GET',
    config: {
        jsonp: 'callback',
        validate: {
            query: {
                route_id: Joi.string().required(),
                direction: Joi.string().optional()
            }
        },
        handler: function (request, reply) {
            var url = [
                config.mcts.base_url,
                'getservicebulletins',
                '?',
                qs({
                    key: config.mcts.key,
                    rt: request.query['route_id'],
                    rtdir: request.query['direction']
                })
            ].join('')
            return proxy.getData(url, function(err, data){
                if (err) throw err
                if (data.error) return reply(Boom.badGateway(proxy.getGatewayError(data)))
                return reply(getHapiSuccessResponse('alerts', getAllAlertsData(data)))
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

server.pack.require('lout', config.lout, function(err){
    if (err) return stop(err)
    server.start(function(err){
        if (err) throw err
        server.emit('start')
        if (config.env !== 'production') return
        checkHealth()
    })
})

function stop(err) {
    if (err instanceof Error) console.error(err.stack)
    server.stop(function(){ process.exit(1) })
}

function getTimeData(data) {
    return mapTime(data)
}

function getAllVehiclesData(data) {
    if (!_.isArray(data.vehicle)) return []
    return _.map(data.vehicle, mapVehicle)
}

function getVehicleData(data) {
    if (!_.isArray(data.vehicle)) return null
    return mapVehicle(data.vehicle[0])
}

function getAllRoutesData(data) {
    if (!_.isArray(data.route)) return []
    return _.map(data.route, mapRoute)
}

function getAllDirectionsData(data) {
    if (!_.isArray(data.dir)) return []
    return data.dir
}

function getAllStopsData(data) {
    if (!_.isArray(data.stop)) return []
    return _.map(data.stop, mapStop)
}

function getAllPatternsData(data) {
    if (!_.isArray(data.ptr)) return []
    return _.map(data.ptr, mapPattern)
}

function getPatternData(data) {
    if (!_.isArray(data.ptr)) return null
    return mapPattern(data.ptr[0])
}

function getAllPredictionsData(data) {
    if (!_.isArray(data.prd)) return []
    return _.map(data.prd, mapPrediction)
}

function getAllAlertsData(data) {
    if (!_.isArray(data.sb)) return []
    return _.map(data.sb, mapAlert)
}

function mapTime(original) {
    return {
        value: formatDate(original['tm'])
    }
}

function mapVehicle(original) {
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

function mapRoute(original) {
    return {
        id: original['rt'][0],
        name: original['rtnm'][0],
        color: original['rtclr'][0]
    }
}

function mapStop(original) {
    return {
        id: original['stpid'][0],
        name: original['stpnm'][0],
        latitude: 1*original['lat'][0],
        longitude: 1*original['lon'][0]
    }
}

function mapPattern(original) {
    return {
        id: original['pid'][0],
        length: 1*original['ln'][0],
        direction: original['rtdir'][0],
        points: _.map(original.pt, mapPoint)
    }
}

function mapPoint(original) {
    var obj = {
        latitude: 1*original['lat'][0],
        longitude: 1*original['lon'][0],
        type: original['typ'][0]
    }
    if (original['stpid']) obj.stop_id = original['stpid'][0]
    if (original['stpnm']) obj.stop_name = original['stpnm'][0]
    if (original['pdist']) obj.distance = 1*original['pdist'][0]
    return obj
}

function mapPrediction(original) {
    return {
        arrival_time: formatDate(original['prdtm'][0]),
        vehicle_id: original['vid'][0],
        distance_away: 1*original['dstp'][0],
        route_id: original['rt'][0],
        direction: original['rtdir'][0],
        destination: original['des'][0],
        is_delayed: original['dly'] ? original['dly'][0] : false,
        ta_block_id: original['tablockid'][0],
        ta_trip_id: original['tatripid'][0],
        zone: original['zone'][0].length > 0 ? original['zone'][0] : null
    }
}

function mapAlert(original) {
    return {
        name: original['nm'][0],
        subject: original['sbj'][0],
        details: original['dtl'][0],
        brief: original['brf'][0],
        priority: original['prty'][0]
    }
}

function formatDate(original) {
    return moment(original, 'YYYYMMDD HH:mm:ss').utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
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

function checkHealth() {
    get('https://mke-bus.herokuapp.com/get/health', function(err){
        if (err) return stop()
        setTimeout(checkHealth, 60e3)
    })
}
