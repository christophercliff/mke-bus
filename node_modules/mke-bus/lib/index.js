var _ = require('underscore')
var get = require('./get')
var own = require('own')
var qs = require('querystring').stringify
var routes = require('./routes.json')

var PARAM_RE = /{.*}$/
var PROTOTYPE = getPrototype(routes)

exports.create = create

function create(options) {
    options = (options || {})
    return Object.create(PROTOTYPE, own({
        location: options.location || 'https://mke-bus.herokuapp.com'
    }))
}

function getMethod(route) {
    return function (options, callback) {
        var path = route.path
        if (route.validate.params) {
            path = route.path.replace(PARAM_RE, options)
        } else if (route.validate.query) {
            path = path + ['?', qs(options)].join('')
        }
        return get([
            this.location,
            path
        ].join('')).nodeify(callback)
    }
}

function getMethodName(path) {
    return _.reduce(path.split('/'), function(current, next){
        if (current.length < 1) return next
        if (next.indexOf('{') === 0) return current
        return current + next.charAt(0).toUpperCase() + next.slice(1)
    })
}

function getPrototype(routes) {
    var proto = {}
    routes.forEach(function(route){
        proto[getMethodName(route.path)] = getMethod(route)
    })
    return proto
}
