import {
    delimiter,
    nodeToFragment,
    isElementNode,
    isTextNode,
    warn,
    noop 
} from './util'
import Watcher from './Watcher'

class Compile {
    constructor(el, vm) {
        this.$el = el
        this.$vm = vm
        this.init(this.$el)
    }
    
    init(el) {
        this.$fragment = nodeToFragment(el)
        this.compileFragment(this.$fragment)
        this.$el.appendChild(this.$fragment)
    }

    compileFragment(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            const text = node.textContent
            if(isElementNode(node)) {
                this.compileElement (node)
            }else if(isTextNode(node) && delimiter.test(node.textContent)) {
                this.compileText(node, RegExp.$1, 'text', this.$vm)
            }

            if(node.childNodes && node.childNodes.length) {
                this.compileFragment(node)
            }
        })
    }

    compileElement(node) {
        const attributes = node.attributes
        Array.from(attributes).forEach(attr => {
            const attrName = attr.name
            if(attrName.startsWith('v-')) {
                const dir = attrName.slice(2)
                const exp = attr.value
                if(dir.startsWith('on:')) {
                    this.event(node, dir, exp, this.$vm)
                }else {
                    this.bind(node, exp, dir, this.$vm)
                }
                node.removeAttribute(attrName)
            }
        })
    }

    compileText(node, exp, dir, vm) {
        this.bind(node, exp, dir, vm)
    } 

    text(node, value) {
        node.textContent = value || ""
    }   

    html(node, value) {
        node.innerHTML = value || ""
    }   

    model(node, value) {
        node.value = value || ""
    }   

    bind(node, exp, dir, vm) {
        const fn = this[dir]
        fn && fn(node, this.getVMValue(vm, exp))
        this.$watcher = new Watcher(vm, exp, (value, oldValue) => {
            fn && fn(node, value, oldValue)
        })
        if(dir === 'model') {
            let oldValue = this.getVMValue(vm, exp)
            node.addEventListener('input', (event) => {
                const value = event.target.value
                if(oldValue === value) {
                    return
                }
                oldValue = value
                this.setVMValue(vm, exp, value)
            }, false)
        }
    }

    event(node, dir, exp, vm) {
        const eventType = dir.split(':')[1]
        const handler = vm.$options.methods && vm.$options.methods[exp]
        !handler && warn(`The method ${exp} is not defined in options`)
        
        node.addEventListener(eventType, (event) => {
            (handler || noop).call(vm)
        }, false)
    }

    getVMValue(vm, exp) {
        let data = vm.$data
        exp.split('.').forEach(key => data = data[key])
        return data
    }

    setVMValue(vm, exp, value) {
        let data = vm.$data
        exp = exp.split('.')
        exp.forEach((key, index) => {
            if(index < exp.length - 1) {
                data = data[key]
            }else {
                data[key] = value
            }
        })
    }

}

export default Compile