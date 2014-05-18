var _ = require('underscore')
var querystring = require('querystring')
var request = require('request')
var xml2js = require('xml2js')

exports.get = get

function get(request, reply) {
    console.log(111, this)
    _.map(this.request_map, function(val, key){
        console.log(222, val, key)
    })
    var qs = querystring.stringify(_.extend({}, this.request_defaults))
    var url = [this.url, qs].join('?')
    console.log(333, url)
    getJSON(url, function(err, json){
        console.log(444, json)
        if (err) throw err
        if (json.error) return reply(getError(json.error[0].msg[0]))
        return reply(json)
    })
}

function getJSON(url, callback) {
    return request(url, function(err, res, data){
        if (err) return callback(err)
        return xml2js.parseString(data, function(err, data){
            if (err) return callback(err)
            try {
                data = mapData(data)
            } catch (ex) {
                return callback(ex)
            }
            return callback(null, data['bustime-response'])
        })
    })
}

function mapData(data) {
    return data
}

function getError(why, statusCode) {
    return {
        'this': 'failed',
        'with': statusCode || 500,
        'because': why
    }
}
