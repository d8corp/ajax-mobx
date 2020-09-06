# ajax-mobx
[![NPM](https://img.shields.io/npm/v/ajax-mobx.svg)](https://github.com/d8corp/ajax-mobx/blob/master/CHANGELOG.md)
[![downloads](https://img.shields.io/npm/dm/ajax-mobx.svg)](https://www.npmjs.com/package/ajax-mobx)
[![license](https://img.shields.io/npm/l/ajax-mobx)](https://github.com/d8corp/ajax-mobx/blob/master/LICENSE)  
Ajax functionality for [Mobx 3](https://mobx.js.org/README.html) and more.
### Installation
npm
```bash
npm i ajax-mobx
```
yarn
```bash
yarn add ajax-mobx
```
### Using
`Ajax` is a `Promise` like constructor
```javascript
import Ajax from 'ajax-mobx'

const user = await new Ajax('https://reqres.in/api/users/1')
// user === "{...}"
```
### then, catch, finally
Use `then`, `catch` and `finally` like for `Promise`
```javascript
const user = new Ajax('https://reqres.in/api/users/1')
user
  .finally(value => console.log('finally', value))
  .then(value => console.log('then', value))
  .catch(value => console.log('catch', value))
```
### loading
You may check status of the request with `loading` field,
it's `true` when data is loading. This field is observable.
```javascript
const user = new Ajax('https://reqres.in/api/users/1')
// user.loading === true

await user
// user.loading === false
```
### loaded
You may check status of the request with `loaded` field,
it's `true` if the data is loaded at least one time.
This is an observable field.
```javascript
const user = new Ajax('https://reqres.in/api/users/1')
// user.loaded === false

await user
// user.loaded === true
```
### value
You may get result with `value`.
This is an observable field.
```javascript
const user = new Ajax('https://reqres.in/api/users/1')

autorun(() => console.log(user.loading ? 'loading...' : user.value))
// autorun from mobx
```
### error
You may handle errors or responses with error status by `error` field.  
This is an observable field.
```javascript
const user = new Ajax('https://reqres.in/api/users/23')
// returns 404 user not found

autorun(() => console.log(
  user.loading ? 'loading...' : user.error || user.value
))
```
### type
You can convert the response to `json` | `text` | `blob` | `arrayBuffer` | `formData`.  
```javascript
const user = new Ajax('https://reqres.in/api/users/1', {type: 'json'})

await user
// user.value.data.id === 1
```
### default
You may provide default `value` for `Ajax`
```javascript
const user = new Ajax('https://reqres.in/api/users/1', {
  type: 'json',
  default: {data: {id: null}}
})

// user.value.data.id === null

await user
// user.value.data.id === 1
```
### response
`response` is the same `value` but without default value.  
This is an observable field.
```javascript
const user = new Ajax('https://reqres.in/api/users/1', {
  type: 'json',
  default: {data: {id: null}}
})

// user.value.data.id === null
// user.response === undefined

await user
// user.value.data.id === 1
// user.response.data.id === 1
```
### data
You can change url of the request via `data` field or option.  
Returns an observable object.
```javascript
const user = new Ajax('https://reqres.in/api/users/{userId}', {
  type: 'json',
  data: {userId: 1}
})
// request to https://reqres.in/api/users/1

await user
// user.value.data.id === 1
```
### update
Unlike a `Promise`, you may reuse `Ajax` with `update` method
```javascript
const user = new Ajax(
  'https://reqres.in/api/users/{userId}',
  {type: 'json'}
)

user.data.userId = 1

await user // request to https://reqres.in/api/users/1
// user.value.data.id === 1

user.data.userId = 2
user.update()

await user // request to https://reqres.in/api/users/2
// user.value.data.id === 2
```
### query
`query` works like data, but it changes URL search params.  
Returns an observable object.
```javascript
const user = new Ajax('https://reqres.in/api/users', {
  type: 'json',
  query: {page: 1}
})
// request to https://reqres.in/api/users?page=1

await user
// user.value.page === 1

user.query.page = 2
user.update()

await user
// user.value.page === 2
```
### resolve
You may use `resolve` to set value without updating or loading.
```javascript
const user = new Ajax('https://reqres.in/api/users/{user}', {data: {user: 1}, type: 'json'})

user.resolve({data: {id: 2}})

await user
// user.value.data.id === 2

user.update()

await user
// user.value.data.id === 1
```
### reject
The same as resolve, but it set an `error` instead of `value`.
### on, once, off
You may add a listener to react on the next events `resolve` | `reject` | `update`
```javascript
const user = new Ajax('https://reqres.in/api/users/1')
let test = false

user.on('resolve', value => test = value)

await user
// test === '{...}'
```
You may add a listener which reacts only once with `once` method.
```javascript
const user = new Ajax('https://reqres.in/api/users/1')
let test = false

user.once('resolve', value => test = value)

await user
// test === '{...}'
```
You may turn off a listener
```javascript
const user = new Ajax('https://reqres.in/api/users/1')
let test = false

const listenr = e => test = e

user.once('resolve', listenr)
user.off('resolve', listenr)

await user
// test === undefined
```
### answer
If you wont to know the status of the response or headers you can use `answer` field.
```javascript
const user = new Ajax('https://reqres.in/api/users/23')

// user.answer === undefined

await user

// user.answer.ok === false
// user.answer.status === 404
```
It's better if you extend `Ajax` class to get it.
```typescript
class Api extends Ajax {
  @computed get status (): number {
    return this.answer?.status
  }
}

const user = new Api('https://reqres.in/api/users/23')

// user.status === undefined

await user

// user.status === 404
```
## Issues
If you find a bug, please file an issue on [GitHub](https://github.com/d8corp/ajax-mobx/issues)  
[![issues](https://img.shields.io/github/issues-raw/d8corp/ajax-mobx)](https://github.com/d8corp/ajax-mobx/issues)  
> ---
[![stars](https://img.shields.io/github/stars/d8corp/ajax-mobx?style=social)](https://github.com/d8corp/ajax-mobx/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/ajax-mobx?style=social)](https://github.com/d8corp/ajax-mobx/watchers)

