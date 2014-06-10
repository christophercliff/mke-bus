var _ = require('underscore')
var async = require('async')
var config = require('./config')
var qs = require('querystring').stringify
var request = require('request')

getAllStops(function(err, data){
    if (err) throw err
    console.log(data)
})

function getAllStops(callback) {
    async.waterfall([
        getRoutes,
        getStops
    ], parseAllStops.bind(null, callback))
}

function getRoutes(callback) {
    request.get([config.location, '/get/all/routes'].join(''), parseSuccess.bind(null, callback))
}

function getStops(routes, callback) {
    async.parallel(_.map(routes, function(route){
        return async.apply(getStopsByRoute, route)
    }), callback)
}

function getStopsByRoute(route, callback) {
    async.waterfall([
        async.apply(getDirectionsByRoute, route),
        async.apply(getStopsByRouteDirections, route)
    ], function(err, res){
        if (err) return callback(err)
        return callback(null, {
            id: route.id,
            stops: res
        })
    })
}

function getDirectionsByRoute(route, callback) {
    request.get([config.location, '/get/all/directions/where?'].join('') + qs({
        route_id: route.id
    }), parseSuccess.bind(null, callback))
}

function getStopsByRouteDirections(route, directions, callback) {
    async.parallel(_.map(directions, function(direction){
        return async.apply(getStopsByRouteDirection, route, direction)
    }), parseStops.bind(null, callback))
}

function getStopsByRouteDirection(route, direction, callback) {
    request.get([config.location, '/get/all/stops/where?'].join('') + qs({
        route_id: route.id,
        direction: direction
    }), parseSuccess.bind(null, callback))
}

function parseSuccess(callback, err, res, body) {
    var data
    if (err) return callback(err)
    try {
        data = JSON.parse(body).with
    } catch (ex) {
        return callback(ex)
    }
    return callback(null, data)
}

function parseStops(callback, err, res) {
    var data
    if (err) return callback(err)
    try {
        data = _.unique(_.reduceRight(res, function(a, b){ return a.concat(b) }), function(n){ return n.id })
    } catch (ex) {
        return callback(ex)
    }
    return callback(null, data)
}

function parseAllStops(callback, err, res) {
    if (err) return callback(err)
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
