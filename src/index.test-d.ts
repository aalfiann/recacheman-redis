import { expectType } from 'tsd'
import RedisStore from './index.js'

const cache = new RedisStore({ prefix: 'cacheman-redis:test' })

expectType<RedisStore>(cache)
expectType<void>(cache.get('key'))
expectType<void>(cache.get('key', (err, data) => {
  if (err) return console.log(err)
  console.log(data)
}))

expectType<void>(cache.set('key1', 1))
expectType<void>(cache.set('key2', '2'))
expectType<void>(cache.set('key3', '3', 30))
expectType<void>(cache.set('key4', '4', 30, (err, data)=> {
  if (err) return console.log(err)
  console.log(data)
}))

expectType<void>(cache.del('key1'))
expectType<void>(cache.del('key2', (err) => {
  if (err) return console.log(err)
}))

expectType<void>(cache.clear((err, data) => {
  if (err) return console.log(err)
  console.log(data)
}))

expectType<void>(cache.scan(0, 10, (err, data) => {
  if (err) return console.log(err)
  console.log(data)
}))

expectType<void>(cache.scan(0, undefined, (err, data) => {
  if (err) return console.log(err)
  console.log(data)
}))



