var _ = require('underscore')
var async = require('async')
var client = require('mke-bus').create({ location: require('./config').location })
var qs = require('querystring').stringify

getAllStops(function(err, data){
    if (err) throw err
    console.log(data)
})

function getAllStops(callback) {
    async.waterfall([
        client.getAllRoutes.bind(client),
        getStops,
        parseAllStops
    ], callback)
}

function getStops(routes, callback) {
    async.parallel(_.map(routes, function(route){
        return async.apply(getStopsByRoute, route)
    }), callback)
}

function getStopsByRoute(route, callback) {
    async.waterfall([
        async.apply(client.getAllDirectionsWhere.bind(client), { route_id: route.id }),
        async.apply(getStopsByRouteDirections, route),
        parseStops
    ], function(err, res){
        if (err) return callback(err)
        return callback(null, {
            id: route.id,
            stops: res
        })
    })
}

function getStopsByRouteDirections(route, directions, callback) {
    async.parallel(_.map(directions, function(direction){
        return async.apply(client.getAllStopsWhere.bind(client), {
            route_id: route.id,
            direction: direction
        })
    }), callback)
}

function parseStops(res, callback) {
    var data
    try {
        data = _.unique(_.reduceRight(res, function(a, b){ return a.concat(b) }), function(n){ return n.id })
    } catch (ex) {
        return callback(ex)
    }
    return callback(null, data)
}

function parseAllStops(res, callback) {
    var data
    try {
        data = _.reduce(res, function(memo, route){
            _.forEach(route.stops, function(stop){
                var _stop = _.findWhere(memo, { id: stop.id })
                if (_stop) return _stop.routes.push(route.id)
                memo.push(_.extend(stop, {
                    routes: [route.id]
                }))
            })
            return memo
        }, [])
    } catch (ex) {
        return callback(ex)
    }
    return callback(null, data)
}
