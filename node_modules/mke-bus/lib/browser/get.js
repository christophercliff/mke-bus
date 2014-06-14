var Boom = require('boom')
var Promise = require('bluebird')
var request = require('reqwest')

var TIMEOUT = 5e3

module.exports = get

function get(url) {
    return new Promise(function(resolve, reject){
        var hasRejected
        setTimeout(function(){
            hasRejected = true
            return reject(Boom.clientTimeout('The request timed out'))
        }, TIMEOUT)
        request({
            url: url,
            type: 'jsonp',
            success: function (data) {
                return resolve(data['with'])
            },
            error: function (err) {
                if (hasRejected) return
                return reject(err)
            }
        })
    })
}
