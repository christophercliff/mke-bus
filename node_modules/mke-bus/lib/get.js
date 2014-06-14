var Boom = require('boom')
var Nipple = require('nipple')
var Promise = require('bluebird')
var request = Promise.promisify(Nipple.get)

module.exports = get

function get(url) {
    return request(url).spread(function(res, payload){
        var data = JSON.parse(payload)
        if (res.statusCode !== 200) throw Boom.create(res.statusCode, data['because'])
        return data['with']
    })
}
