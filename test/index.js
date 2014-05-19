var _ = require('underscore')
var async = require('async')
var fs = require('fs')
var path = require('path')
var proxy = require('../lib/proxy')
var qs = require('querystring').stringify
var server = require('../')
var supertest = require('supertest')

var HOST = 'http://127.0.0.1:8000'

before(function(done){
    server.on('start', done)
})

describe('/get/time', function(){

    it('should get the time', function(done){
        supertest(HOST)
            .get('/get/time')
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/all/vehicles/where', function(){

    it('should return 400 for bad requests', function(done){
        supertest(HOST)
            .get('/get/all/vehicles/where')
            .expect(400)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiFailure(res.body)
                return done()
            })
    })

    it('should get the vehicles', function(done){
        supertest(HOST)
            .get(['/get/all/vehicles/where', qs({
                route_id: '21'
            })].join('?'))
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/vehicle/called/{vehicle_id}', function(){

    it('should return 502 for bad gateway', function(done){
        supertest(HOST)
            .get('/get/vehicle/called/abc')
            .expect(502)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiFailure(res.body)
                return done()
            })
    })

    it('should get the vehicle', function(done){
        supertest(HOST)
            .get('/get/vehicle/called/5115')
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/all/routes', function(){

    it('should get the routes', function(done){
        supertest(HOST)
            .get('/get/all/routes')
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/all/directions', function(){

    it('should return 400 for bad requests', function(done){
        supertest(HOST)
            .get('/get/all/directions/where')
            .expect(400)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiFailure(res.body)
                return done()
            })
    })

    it('should get the directions', function(done){
        supertest(HOST)
            .get(['/get/all/directions/where', qs({
                route_id: '21'
            })].join('?'))
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/all/stops/where', function(){

    it('should return 400 for bad requests', function(done){
        supertest(HOST)
            .get('/get/all/stops/where')
            .expect(400)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiFailure(res.body)
                return done()
            })
    })

    it('should get the stops', function(done){
        supertest(HOST)
            .get(['/get/all/stops/where', qs({
                route_id: '21',
                direction: 'EAST'
            })].join('?'))
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/all/patterns/where', function(){

    it('should return 400 for bad requests', function(done){
        supertest(HOST)
            .get('/get/all/patterns/where')
            .expect(400)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiFailure(res.body)
                return done()
            })
    })

    it('should get the patterns', function(done){
        supertest(HOST)
            .get(['/get/all/patterns/where', qs({
                route_id: '21'
            })].join('?'))
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('/get/pattern/called/{pattern_id}', function(){

    it('should return 502 for bad gateway', function(done){
        supertest(HOST)
            .get('/get/pattern/called/abc')
            .expect(502)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiFailure(res.body)
                return done()
            })
    })

    it('should get the pattern', function(done){
        supertest(HOST)
            .get('/get/pattern/called/13')
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapiSuccess(res.body)
                return done()
            })
    })

})

describe('proxy.getGatewayError()', function(){

    it('should parse error messages', function(done){
        var errors = _.map({
            './fixtures/getvehicles-bad-request.xml': 'No data found for parameter',
            './fixtures/gettime-bad-request.xml': 'Invalid API access key supplied'
        }, function(message, path){
            return { message: message, path: path }
        })
        async.each(errors, function(n, callback){
            fs.readFile(path.resolve(__dirname, n.path), { encoding: 'utf8' }, function(err, xml){
                if (err) throw err
                proxy.toData(xml, function(err, data){
                    if (err) throw err
                    proxy.getGatewayError(data).should.equal(n.message)
                    return callback(null)
                })
            })
        }, done)
    })

})

function shouldBeHapiSuccess(body) {
    body.should.be.an.instanceof(Object)
    body.should.have.property('this', 'succeeded')
    body.should.have.property('by')
    body.should.have.property('the')
    body.should.have.property('with')
}

function shouldBeHapiFailure(body) {
    body.should.be.an.instanceof(Object)
    body.should.have.property('this', 'failed')
    body.should.have.property('with')
    body.should.have.property('because')
}
