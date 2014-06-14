var client = require('../').create()

var ROUTE_ID = '21'
var STOP_ID = '3635'
var VEHICLE_ID = '5336'
var DIRECTION = 'EAST'
var PATTERN_ID = 13
var TIMEOUT = 10e3

before(function(){
    require('should')
})

describe('client.getTime()', function(){

    this.timeout(TIMEOUT)

    it('should get the time', function(done){
        client
            .getTime()
            .then(function(data){
                data.should.be.an.instanceof(Object)
                data.should.have.property('value')
                return done()
            }, done)
    })

})

describe('client.getAllRoutes()', function(){

    this.timeout(TIMEOUT)

    it('should get the routes', function(done){
        client
            .getAllRoutes()
            .then(function(data){
                data.should.be.an.instanceof(Array)
                data.length.should.be.greaterThan(0)
                ROUTE_ID = data[0].id || ROUTE_ID
                return done()
            }, done)
    })

})

describe('client.getAllVehiclesWhere(options)', function(){

    this.timeout(TIMEOUT)

    it('should throw 400 for bad requests', function(done){
        client
            .getAllVehiclesWhere()
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(400)
                return done()
            })
    })

    it('should get the vehicles', function(done){
        client
            .getAllVehiclesWhere({
                route_id: ROUTE_ID
            })
            .then(function(data){
                data.should.be.an.instanceof(Array)
                data.length.should.be.greaterThan(0)
                VEHICLE_ID = data[0].id || VEHICLE_ID
                return done()
            }, done)
    })

})

describe('client.getVehicleCalled(id)', function(){

    this.timeout(TIMEOUT)

    it('should throw 502 for bad gateway', function(done){
        client
            .getVehicleCalled('abc')
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(502)
                return done()
            })
    })

    it('should get the vehicle', function(done){
        client
            .getVehicleCalled(VEHICLE_ID)
            .then(function(data){
                data.should.be.an.instanceof(Object)
                data.should.have.property('id')
                return done()
            }, done)
    })

})

describe('client.getAllDirectionsWhere(options)', function(){

    this.timeout(TIMEOUT)

    it('should throw 400 for bad requests', function(done){
        client
            .getAllDirectionsWhere()
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(400)
                return done()
            })
    })

    it('should get the directions', function(done){
        client
            .getAllDirectionsWhere({
                route_id: ROUTE_ID
            })
            .then(function(data){
                data.should.be.an.instanceof(Array)
                data.length.should.be.greaterThan(0)
                DIRECTION = data[0] || DIRECTION
                return done()
            }, done)
    })

})

describe('client.getAllStopsWhere(options)', function(){

    this.timeout(TIMEOUT)

    it('should throw 400 for bad requests', function(done){
        client
            .getAllStopsWhere()
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(400)
                return done()
            })
    })

    it('should get the stops', function(done){
        client
            .getAllStopsWhere({
                route_id: ROUTE_ID,
                direction: DIRECTION
            })
            .then(function(data){
                data.should.be.an.instanceof(Array)
                data.length.should.be.greaterThan(0)
                STOP_ID = data[0].id || STOP_ID
                return done()
            }, done)
    })

})

describe('client.getAllPatternsWhere(options)', function(){

    this.timeout(TIMEOUT)

    it('should throw 400 for bad requests', function(done){
        client
            .getAllPatternsWhere()
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(400)
                return done()
            })
    })

    it('should get the patterns', function(done){
        client
            .getAllPatternsWhere({
                route_id: ROUTE_ID
            })
            .then(function(data){
                data.should.be.an.instanceof(Array)
                data.length.should.be.greaterThan(0)
                PATTERN_ID = data[0].id || PATTERN_ID
                return done()
            }, done)
    })

})

describe('client.getPatternCalled(id)', function(){

    this.timeout(TIMEOUT)

    it('should throw 502 for bad gateway', function(done){
        client
            .getPatternCalled('abc')
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(502)
                return done()
            })
    })

    it('should get the pattern', function(done){
        client
            .getPatternCalled(PATTERN_ID)
            .then(function(data){
                data.should.be.an.instanceof(Object)
                data.should.have.property('id')
                return done()
            }, done)
    })

})

describe('client.getAllPredictionsWhere(options)', function(){

    this.timeout(TIMEOUT)

    it('should throw 400 for bad requests', function(done){
        client
            .getAllPredictionsWhere()
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(400)
                return done()
            })
    })

    it('should get the predictions', function(done){
        client
            .getAllPredictionsWhere({
                stop_id: STOP_ID,
                route_id: ROUTE_ID,
                take: '1'
            })
            .then(function(data){
                data.should.be.an.instanceof(Array)
                data.length.should.be.greaterThan(0)
                return done()
            }, done)
    })

})

describe('client.getAllAlertsWhere(options)', function(){

    this.timeout(TIMEOUT)

    it('should throw 400 for bad requests', function(done){
        client
            .getAllAlertsWhere()
            .catch(function(err){
                err.should.be.an.instanceof(Error)
                //err.output.statusCode.should.equal(400)
                return done()
            })
    })

    it('should get the alerts', function(done){
        client
            .getAllAlertsWhere({
                route_id: ROUTE_ID,
                direction: DIRECTION
            })
            .then(function(data){
                data.should.be.an.instanceof(Array)
                return done()
            }, done)
    })

})
