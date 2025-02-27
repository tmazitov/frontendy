import createElement from "./createElement";
import VNode from "./VNode";



function addNewElement(parent: HTMLElement, newVNode: VNode|null, index: number) {
    parent.appendChild(createElement(newVNode));  
}

function removeNewElement(parent: HTMLElement, index: number) {
    parent.removeChild(parent.childNodes[index]);
}

function replaceElement(parent: HTMLElement, newVNode: VNode, index: number) {
    parent.replaceChild(createElement(newVNode), parent.childNodes[index]);
}

function updateElement(parent: HTMLElement, oldVNode: VNode | null, newVNode: VNode | null, index = 0) {

    if (!oldVNode) {
        addNewElement(parent, newVNode, index);
        return
    }

    if (!newVNode) {
        removeNewElement(parent, index);
        return
    }

    if (newVNode !== oldVNode && (typeof newVNode === "string" || typeof oldVNode === "string")) {
        replaceElement(parent, newVNode as VNode, index);
        return
    } 

    if (newVNode.tag !== oldVNode.tag) {
        replaceElement(parent, newVNode, index);
        return
    }
    
    // Update props
    for (const key in oldVNode.props) {
        if (!(key in newVNode.props!)) {
            (parent.childNodes[index] as HTMLElement).removeAttribute(key);
        }
    }
    for (const key in newVNode.props) {
        if (oldVNode.props?.[key] !== newVNode.props[key]) {
            (parent.childNodes[index] as HTMLElement).setAttribute(key, newVNode.props[key]);
        }
    }

    // Compare children recursively
    for (let i = 0; i < newVNode.children!.length || i < oldVNode.children!.length; i++) {
        const newParent = parent.childNodes[index] as HTMLElement;

        const oldChild = oldVNode.children?.[i] as VNode;
        const newChild = newVNode.children?.[i] as VNode;

        updateElement(newParent, oldChild, newChild, i);
    }
}

export default updateElement;