var Joi = require('joi')

var KEY = 'Er9tgfgC8ps4ikzriNr5W3x2w'
var SOURCE = 'http://realtime.ridemcts.com/bustime/api/v1'
var VEHICLE_RESPONSE_MAP = {
    vid: 'id',
    tmstmp: 'date_updated',
    lat: 'latitude',
    lon: 'longitude',
    hdg: 'heading',
    pid: 'pattern_id',
    pdist: 'pattern_distance',
    rt: 'route_id',
    des: 'destination',
    dly: 'is_delayed',
    spd: 'speed',
    tablockid: 'ta_block_id',
    tatripid: 'ta_trip_id',
    zone: 'zone'
}

//'/get/time'
//'/get/all/vehicles/where/?route=asfd'
//'/get/vehicle/called/id'
//'/get/all/routes'
/*'/get/all/directions/where/?route=asdf'

'/get/all/stops/where/?route=asdf&direction=asdf'
'/get/all/patterns/where/?route=asfd'
'/get/pattern/called/id'
'/get/all/predictions/where/?stop=asdf&route=asdf&vehicle=asdf&take=asdf'
'/get/all/alerts/where/?route=asdf&direction=asdf&stop=asdf'*/

module.exports = [
    {
        path: '/get/time',
        url: [SOURCE, '/gettime'].join(''),
        request_defaults: {
            key: KEY
        },
        request_map: null,
        response_map: null,
        config: null
    },
    {
        path: '/get/all/vehicles/where/',
        url: [SOURCE, '/getvehicles'].join(''),
        request_defaults: {
            key: KEY,
            tmres: 's'
        },
        request_map: {
            query: {
                route_id: 'rt'
            }
        },
        response_map: VEHICLE_RESPONSE_MAP,
        config: {
            validate: {
                query: {
                    route_id: Joi.string().required()
                }
            }

        }
    },
    {
        path: '/get/vehicle/called/{id}',
        url: [SOURCE, '/getvehicles'].join(''),
        request_defaults: {
            key: KEY,
            tmres: 's'
        },
        request_map: {
            params: {
                id: 'vid'
            }
        },
        response_map: VEHICLE_RESPONSE_MAP,
        config: {
            validate: {
                path: {
                    id: Joi.number().required()
                }
            }
        }
    },
    {
        path: '/get/all/routes',
        url: [SOURCE, '/getroutes'].join(''),
        request_defaults: {
            key: KEY
        },
        request_map: null,
        response_map: {
            rt: 'id',
            rtnm: 'name',
            rtclr: 'color'
        },
        config: null
    }
]
