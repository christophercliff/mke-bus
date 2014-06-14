# Own

## Simple `propertiesObject` creation for use with `Object.create()`

The [`propertiesObject`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) is painfully verbose. `own` is a helper function that makes it easy to create enumerable and writable `propertiesObject`s from an object literal.

[![Build Status](https://secure.travis-ci.org/christophercliff/own.png?branch=master)](https://travis-ci.org/christophercliff/own)

## Installation

```
$ npm install own
```

## Usage

Use the result of `own()` as the second parameter in [`Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create):

```js
var own = require('own')
var yourObject = Object.create(YOUR_PROTOTYPE, own({ hello: 'world' }))

yourObject.hasOwnProperty('hello') // true
yourObject.hello // 'world'
```

## Tests

Install the dependencies and run:

```
$ npm test
```

## License

MIT License, see [LICENSE](https://github.com/christophercliff/own/blob/master/LICENSE.md) for details.
