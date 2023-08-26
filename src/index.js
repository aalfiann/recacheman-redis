'use strict'

/**
 * Module dependencies.
 */

const redis = require('redis')
const parser = require('parse-redis-url')
const each = require('each')

/**
 * Module constants.
 */

const parse = parser(redis).parse
const noop = () => {}

class RedisStore {
  /**
   * RedisStore constructor.
   *
   * @param {String|Object} options
   * @api public
   */

  constructor(options = {}) {
    if ('string' === typeof options) {
      options = parse(options)
    }

    const { url, port, host, client, setex, password, database, prefix } = options

    if ('function' === typeof setex) {
      this.client = options
    } else if (client) {
      if ('string' === typeof client) {
        this.client = redis.createClient({ url: client })
      } else if ('object' === typeof client) {
        this.client = redis.createClient(client)
      } else {
        // fallback if type is not detected
        this.client = client
      }
    } else if (!port && !host) {
      this.client = redis.createClient()
    } else {
      const opts = Object.assign({}, options, { prefix: null })
      
      if (!url) {
        opts.url = 'redis://' + host + ':' + port
      }

      this.client = redis.createClient(opts)
    }

    if (password) {
      this.client.auth(password, (err) => {
        if (err) throw err
      })
    }

    if (database) {
      this.client.select(database, (err) => {
        if (err) throw err
      })
    }

    this.prefix = prefix || 'cacheman:'
    
    this.client.connect()
  }

  /**
   * Get an entry.
   *
   * @param {String} key
   * @param {Function} fn
   * @api public
   */

  get(key, fn = noop) {
    const k = `${this.prefix}${key}`
    this.client.get(k).then(data => {
      if (!data) return fn(null, null)
      data = data.toString()
      try {
        fn(null, JSON.parse(data))
      } catch (e) {
        fn(e)
      }
    }).catch(err => {
      return fn(err)
    })
  }

  /**
   * Set an entry.
   *
   * @param {String} key
   * @param {Mixed} val
   * @param {Number} ttl
   * @param {Function} fn
   * @api public
   */

  set(key, val, ttl, fn = noop) {
    const k = `${this.prefix}${key}`

    if ('function' === typeof ttl) {
      fn = ttl
      ttl = null
    }

    try {
      val = JSON.stringify(val)
    } catch (e) {
      return fn(e)
    }

    if (-1 === ttl) {
      this.client.set(k, val).then(data => {
        return fn(null, data)
      }).catch(err => {
        return fn(err)
      })
    } else {
      this.client.set(k, val, {
        EX: ttl || 60,
        NX: false
      }).then(data => {
        return fn(null, data)
      }).catch(err => {
        return fn(err)
      })
    }
  }

  /**
   * Delete an entry (Supported glob-style patterns).
   *
   * @param {String} key
   * @param {Function} fn
   * @api public
   */

  del(key, fn = noop) {
    const k = `${this.prefix}${key}`
    this.client.sendCommand(['UNLINK', `${k}`]).then(() => {
      return fn(null, null)
    }).catch(err => {
      return fn(err)
    })
  }

  /**
   * Clear all entries in cache.
   *
   * @param {Function} fn
   * @api public
   */

  clear(fn = noop) {
    const k = `${this.prefix}*`
    this.client.sendCommand(['KEYS', `${k}`]).then((data) => {
      let count = data.length
      if (count === 0) return fn(null, null)
      for (var i = 0; i < count; i++) {
        this.client.sendCommand(['UNLINK', `${data[i]}`]).then(() => {
          if (--count == 0) {
            fn(null, null)
          }
        }).catch(err => {
          count = 0
          return fn(err)
        })
      }
    }).catch(err => {
      return fn(err)
    })
  }

  /**
   * Scan for a number of entries from a cursor point
   *
   * @param {Number}   cursor
   * @param {Number}   fn
   * @param {Function} fn
   * @api public
   */

  scan(cursor, count = 10, fn = noop) {
    const entries = []
    const prefix = this.prefix
    const self = this

    this.client.sendCommand(['SCAN', `${cursor}`, 'MATCH', `${prefix}*`, 'COUNT', `${count}`]).then((data) => {
      const [newCursor, keys] = data

      each(keys).call((key, index, next) => {
        const _key = key.replace(`${this.prefix}`, '')

        self.get(_key, (err, data) => {
          if (err) return fn(err)

          entries.push({ key: _key, data })
          next()
        })
      }).next(() => {
        fn(null, { cursor: Number(newCursor), entries })
      })
    }).catch(err => {
      return fn(err)
    })
  }
}

module.exports = RedisStore
