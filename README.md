# mke-bus

[![Build Status](https://travis-ci.org/christophercliff/mke-bus.png?branch=master)](https://travis-ci.org/christophercliff/mke-bus)

This project aims to provide an independent, open and open source interface to the [Milwaukee Country Transit System][mcts] real time [bus location data][bustime]. It's currently accessible at [https://mke-bus.herokuapp.com/][herokuapp].

## Features

- [x] Publicly accessible--no access key required
- [x] Web and human friendly [HAPI-REST][hapi] API
- [x] Allow cross-domain requests via [JSONP][jsonp] or [CORS][cors]
- [x] Fully documented API
- [ ] JavaScript client (for the browser and node.js)
- [ ] Interface for spatial querying bus stops
- [ ] Streaming interface for bus arrival times
- [ ] User-facing web and mobile applications

## Contributing

See [CONTRIBUTING][contributing] for details.

## License

MIT, see [LICENSE][license] for details.

[mcts]: http://www.ridemcts.com/
[bustime]: http://realtime.ridemcts.com/bustime/home.jsp
[herokuapp]: https://mke-bus.herokuapp.com/
[hapi]: https://github.com/jheising/HAPI
[jsonp]: http://en.wikipedia.org/wiki/JSONP
[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
[contributing]: https://github.com/christophercliff/mke-bus/blob/master/CONTRIBUTING.md
[license]: https://github.com/christophercliff/mke-bus/blob/master/LICENSE.md
