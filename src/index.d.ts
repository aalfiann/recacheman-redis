/**
 * Module dependencies.
 */
// declare const redis: any;
// declare const parser: any;
// declare const each: any;
/**
 * Module constants.
 */
// declare const parse: any;
// declare const noop: () => void;
export default class RedisStore {
    /**
     * RedisStore constructor.
     *
     * @param {String|Object} options
     * @api public
     */
    constructor(options?:string|object);
    /**
     * Get an entry.
     *
     * @param {String} key
     * @param {Function} fn
     * @api public
     */
    get(key: string, fn?: (err: any, data: any) => void): void;
    /**
     * Set an entry.
     *
     * @param {String} key
     * @param {Mixed} val
     * @param {Number} ttl
     * @param {Function} fn
     * @api public
     */
    set(key: string, val: any, ttl?: number, fn?: (err: any, data: any) => void): void;
    /**
     * Delete an entry (Supported glob-style patterns).
     *
     * @param {String} key
     * @param {Function} fn
     * @api public
     */
    del(key: string, fn?: (err: any) => void): void;
    /**
     * Clear all entries in cache.
     *
     * @param {Function} fn
     * @api public
     */
    clear(fn?: (err: any, data: any) => void): void;
    /**
     * Scan for a number of entries from a cursor point
     *
     * @param {Number}   cursor
     * @param {Number}   fn
     * @param {Function} fn
     * @api public
     */
    scan(cursor: number, count?: number, fn?: (err: any, data: any) => void): void;
}
