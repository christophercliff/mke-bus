var _ = require('underscore')
var get = require('request').get
var xml2js = require('xml2js').parseString

exports.getData = getData
exports.getGatewayError = getGatewayError
exports.toData = toData

function getData(url, callback) {
    return get(url, function(err, res, body){
        if (err) return callback(err)
        return toData(body, callback)
    })
}

function getGatewayError(data) {
    return _.chain(data)
        .flatten()
        .first()
        .map(function(val, key){
            if (key !== 'msg') return null
            return val
        })
        .compact()
        .flatten()
        .first()
        .value()
}

function toData(body, callback) {
    return xml2js(body, function(err, json){
        if (err) return callback(err)
        return callback(null, _.chain(json).flatten().first().value())
    })
}
