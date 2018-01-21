export let did = 0

class Dependency {
    static target = null

    constructor() {
        this.id = did++
        this.subs = []
    }

    putSubs(sub) {
        this.subs.push(sub)
    }

    deleteSub(sub) {
        const index = this.subs.indexOf(sub)
        indexOf !== 1 && this.subs.splice(index, 1)
    }

    notify() {
        this.subs.forEach(sub => sub.update())
    }

    depend() {
        console.log(this)
        Dependency.target.addDependency(this)
    }
}

export default Dependency