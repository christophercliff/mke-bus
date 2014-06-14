# mke-bus-client

[![Build Status](https://travis-ci.org/christophercliff/mke-bus-client.png?branch=master)](https://travis-ci.org/christophercliff/mke-bus-client)

A JavaScript client for the [mke-bus][mke-bus] service.

## Usage

In node.js or a web browser:

```js
var client = require('mke-bus').create()

// using promises

client.getAllRoutes()
    .catch(function(err){ throw err })
    .then(function(routes){ console.log(routes) })

// or callbacks

client.getAllRoutes(function(err, routes){
    if (err) throw err
    console.log(routes)
})
```

## Installation

```
$ npm install mke-bus
```

## API

See [API][api] for details.

## Contributing

See [CONTRIBUTING][contributing] for details.

## License

MIT, see [LICENSE][license] for details.

[mke-bus]: https://github.com/christophercliff/mke-bus
[api]: https://mke-bus.herokuapp.com/
[contributing]: https://github.com/christophercliff/mke-bus-client/blob/master/CONTRIBUTING.md
[license]: https://github.com/christophercliff/mke-bus-client/blob/master/LICENSE.md
