import Dependency from './Dependency'

class Observe {
    constructor(data = {}, vm) {
        if(Object.prototype.toString.call(data) !== '[object Object]') {
            return
        }
        this.data = data
        this._vm = vm
        this.makeDataReactive(this.data)
    }

    makeDataReactive(data) {
        Object.keys(data).forEach(key => this.defineReactive(this.data, key, data[key]))
    }

    makeSubDataReactive(data) {
        return new Observe(data, this._vm)
    }

    defineReactive(data, key, val) {
        const dep = new Dependency()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get() {
                if(Dependency.target) {
                    dep.depend()
                }
                return val
            },
            set: (newVal) => {
                if(val === newVal) {
                    return
                }
                val = newVal
                this.makeSubDataReactive(val)
                dep.notify()
            }
        })
        this.makeSubDataReactive(val)
    }
}

export default Observe