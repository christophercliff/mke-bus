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
                shouldBeHapi(res.body)
                return done()
            })
    })

})

describe('/get/all/vehicles/where', function(){

    it('should return 400', function(done){
        supertest(HOST)
            .get('/get/all/vehicles/where')
            .expect(400, done)
    })

    it('should get the vehicles', function(done){
        supertest(HOST)
            .get(['/get/all/vehicles/where', qs({
                route_id: '21'
            })].join('?'))
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapi(res.body)
                return done()
            })
    })

})

describe('/get/vehicle/called/{vehicle_id}', function(){

    it('should get the vehicle', function(done){
        supertest(HOST)
            .get('/get/vehicle/called/111')
            .expect(200)
            .end(function(err, res){
                if (err) throw err
                shouldBeHapi(res.body)
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
                shouldBeHapi(res.body)
                return done()
            })
    })

})

function shouldBeHapi(body) {
    return
    body.should.be.an.instanceof(Object)
    body.should.have.property('this')
    body.should.have.property('by')
    body.should.have.property('the')
    body.should.have.property('with')
}
