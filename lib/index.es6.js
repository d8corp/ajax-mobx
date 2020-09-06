import { __decorate } from 'tslib';
import Async from 'async-mobx';
import { observable, action } from 'mobx';

class Ajax extends Async {
    constructor(url, options = {}) {
        const { type = 'text' } = options;
        const request = (resolve, reject) => {
            let query = '';
            for (const key in this.query) {
                const value = this.query[key];
                if (!value)
                    continue;
                if (Array.isArray(value)) {
                    for (const subValue of value) {
                        query += (query && '&') + key + '[]=' + subValue;
                    }
                }
                else {
                    query += (query && '&') + key + '=' + value;
                }
            }
            if (query) {
                query = '?' + query;
            }
            let answer;
            fetch(url.replace(/\{(\w+)\}/g, (str, key) => this.data[key] + '') + query, options).then(data => {
                answer = data;
                return data[type]();
            }).then(action(data => {
                this.answer = answer;
                answer.status > 399 ? reject(data) : resolve(data);
            }), action(e => {
                this.answer = answer;
                reject(e);
            }));
        };
        super(Object.assign(Object.assign({}, options), { request }));
        this.query = options.query || {};
        this.data = options.data || {};
    }
}
__decorate([
    observable.shallow
], Ajax.prototype, "query", void 0);
__decorate([
    observable.shallow
], Ajax.prototype, "data", void 0);
__decorate([
    observable.ref
], Ajax.prototype, "answer", void 0);

export default Ajax;
