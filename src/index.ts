import Async, {AsyncOptions} from 'async-mobx'
import {observable, action} from 'mobx'

type AjaxQueryType = string | number | boolean
export type AjaxQuery = AjaxQueryType | AjaxQueryType[]
export type AjaxQueryObject = Record<string, AjaxQuery>
export type AjaxData = Record<string, string | number>
export type AjaxOptions <D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> = RequestInit & Omit<AsyncOptions, 'request'> & {
  data?: D
  query?: Q
  type?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
}

class Ajax<V = any, E = any, D extends AjaxData = AjaxData, Q extends AjaxQueryObject = AjaxQueryObject> extends Async<V, E> {
  @observable.shallow query: Q
  @observable.shallow data: D
  @observable.ref answer: Response

  constructor (url: string, options: AjaxOptions<D, Q> = {}) {
    const {type = 'text'} = options

    const request = (resolve, reject) => {
      let query = ''
      for (const key in this.query) {
        const value = this.query[key]
        if (!value) continue
        if (Array.isArray(value)) {
          for (const subValue of value) {
            query += (query && '&') + key + '[]=' + subValue
          }
        } else {
          query += (query && '&') + key + '=' + value
        }
      }
      if (query) {
        query = '?' + query
      }
      let answer
      fetch(url.replace(/\{(\w+)\}/g, (str, key) => this.data[key] + '') + query, options).then(data => {
        answer = data
        return data[type]()
      }).then(action(data => {
        this.answer = answer
        answer.status > 399 ? reject(data) : resolve(data)
      }), action(e => {
        this.answer = answer
        reject(e)
      }))
    }

    super({...options, request})

    this.query = options.query || {} as Q
    this.data = options.data || {} as D
  }
}

export default Ajax
