> This is a fork version of [cacheman-redis](https://github.com/cayasso/cacheman-redis) with following differences :
- Minimum NodeJS 14
- Removed old libraries
- Typescript support
- Up to date

# recacheman-redis

[![NPM](https://nodei.co/npm/recacheman-redis.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/recacheman-redis/)  
  
[![npm version](https://img.shields.io/npm/v/recacheman-redis.svg?style=flat-square)](https://www.npmjs.org/package/recacheman-redis)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/aalfiann/recacheman-redis/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/aalfiann/recacheman-redis/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/aalfiann/recacheman-redis/badge.svg?branch=master)](https://coveralls.io/github/aalfiann/recacheman-redis?branch=master)
[![Known Vulnerabilities](https://snyk.io//test/github/aalfiann/recacheman-redis/badge.svg?targetFile=package.json)](https://snyk.io//test/github/aalfiann/recacheman-redis?targetFile=package.json)
![License](https://img.shields.io/npm/l/recacheman-redis)
![NPM download/month](https://img.shields.io/npm/dm/recacheman-redis.svg)
![NPM download total](https://img.shields.io/npm/dt/recacheman-redis.svg)  

Redis standalone caching library for Node.JS and also cache engine for [recacheman](https://github.com/aalfiann/recacheman).

## Instalation

``` bash
$ npm install recacheman-redis
```

> Important:  
  If you are using NodeJS 12.x or below, you have to use old [recacheman-redis 2.x](https://github.com/aalfiann/recacheman-redis/tags).  
  This new version of recacheman-redis already using the latest [redis 4.x](https://github.com/redis/node-redis) library.

## Usage

```javascript
var CachemanRedis = require('recacheman-redis');
var cache = new CachemanRedis();

// set the value
cache.set('my key', { foo: 'bar' }, function (error) {

  if (error) throw error;

  // get the value
  cache.get('my key', function (error, value) {

    if (error) throw error;

    console.log(value); //-> {foo:"bar"}

    // delete entry
    cache.del('my key', function (error){

      if (error) throw error;

      console.log('value deleted');
    });

  });
});
```

## API

### CachemanRedis([options])

Create `cacheman-redis` instance. `options` are redis valid options including `port` and `host`.

Note: 
- Redis 4.x actualy has removed `port` and `host` options, but I still keep support it in this library.
- For more details, please see here >> [Redis 4.x Client Configuration Options](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md).

```javascript
var options = {
  port: 9999,
  host: '127.0.0.1',
  password: 'my-p@ssw0rd'
  database: 1
};

var cache = new CachemanRedis(options);
```

You can also pass a redis connection string as first arguments like this:

```javascript
var cache = new CachemanRedis('redis://127.0.0.1:6379');
```

Or pass a redis connection string as object like this:

```javascript
var cache new CachemanRedis({ url: 'redis://localhost:6379'})
```

Or pass a redis `client` instance directly as client:

```javascript
var client = redis.createClient();

var cache = new CachemanRedis(client);

// or
cache = new CachemanRedis({ client: client });
```

Or pass a redis `client` directly with connection uri:
```javascript
var cache = new CachemanRedis({ client: 'redis://localhost:6379' });
```

### cache.set(key, value, [ttl, [fn]])

Stores or updates a value.

```javascript
cache.set('foo', { a: 'bar' }, function (err, value) {
  if (err) throw err;
  console.log(value); //-> {a:'bar'}
});
```

Or add a TTL(Time To Live) in seconds like this:

```javascript
// key will expire in 60 seconds
cache.set('foo', { a: 'bar' }, 60, function (err, value) {
  if (err) throw err;
  console.log(value); //-> {a:'bar'}
});
```

### cache.get(key, fn)

Retrieves a value for a given key, if there is no value for the given key a null value will be returned.

```javascript
cache.get(function (err, value) {
  if (err) throw err;
  console.log(value);
});
```

### cache.del(key, [fn])

Deletes a key out of the cache.

```javascript
cache.del('foo', function (err) {
  if (err) throw err;
  // foo was deleted
});
```

### cache.clear([fn])

Clear the cache entirely, throwing away all values.

```javascript
cache.clear(function (err) {
  if (err) throw err;
  // cache is now clear
});
```

### cache.scan(cursor, count, [fn])

[Scan](https://redis.io/commands/scan) cache from a cursor point and return a count of values

```javascript
cache.set('foo', { a: 'bar' }, 10, function (err) {
  cache.scan(0, 10, function (err, result) {
    console.log(result) // { cursor: 0, entries: [{ key: 'foo', data: { a: 'bar' } }] }
  });
});
````

## Run tests

```
npm test
```

## License

(The MIT License)

Copyright (c) 2014 Jonathan Brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
