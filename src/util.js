export const warn = (warning) => console.warn(warning)
export const isElementNode = (node) => node.nodeType === 1
export const isTextNode = (node) => node.nodeType === 3
export const query = (el) => isElementNode(el) && el || document.querySelector(el)
export const delimiter = /\{\{(.*)\}\}/
export const nodeToFragment = (node) => {
    const fragment = document.createDocumentFragment()
    let child = null

    while(child = node.firstChild) {
        fragment.appendChild(child)
    }

    return fragment
}
export const noop = () => {}