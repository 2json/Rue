import Dependency from './Dependency'

class Watcher {
    constructor(vm, exp, cb) {
        this.vm = vm
        this.exp = exp
        this.cb = cb
        this.depIds = {}
        this.value = this.get()
    }
    update() {
        this.run()
    }
    run() {
        const value = this.get()
        const oldValue = this.value
        if(value !== oldValue) {
            this.value = value
            this.cb.call(this.vm, value, oldValue)
        }
    }
    get() {
        Dependency.target = this
        const value = this.getVMVal()
        Dependency.target = null
        return value
    }
    getVMVal() {
        const exp = this.exp.split('.')
        let data = this.vm.$data
        exp.forEach(key => data = data[key])
        return data
    }
    addDependency(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.putSubs(this);
            this.depIds[dep.id] = dep;
        }
    }
}

export default Watcher