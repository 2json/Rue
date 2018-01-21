import { warn, query } from './util'
import Observe from './Observe'
import Compile from './Compile'

class Rue {
    constructor(options) {
        if(!options.el) {
            warn(
                `You should set an el key in your options to render the application!!!`
            )
        }
        this._init(options)
    }

    _init(options) {
        this.$options = options || {}
        this.$el = query(options.el)
        this.$data = this.$options.data
        this._proxyData(this.$data)
        this.$$observe = new Observe(this.$data, this)
        this.$$compile = new Compile(this.$el, this)
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                set: (val) => {
                    this.$data[key] = val
                },
                get: () => {
                    return this.$data[key]
                }
            })
        })
    }
}
export default Rue