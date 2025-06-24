import FrontendyComponent from "../component/component";
import createElement from "./createElement";
import VElem from "./VElem";
import VNode from "./VNode";
import VText from "./VText";


function addNewElement(parent: HTMLElement, newVNode: VNode | FrontendyComponent | null) {
    if (newVNode instanceof FrontendyComponent) {
        newVNode.mount(parent)
    } else {
        const childElem = createElement(newVNode)
        if (!childElem) {
            return ;
        }
        parent.appendChild(childElem);  
    }
}

function removeNewElement(parent: HTMLElement, index: number) {

    const child = parent.childNodes[index]
    if (!child) {
        return
    }
    
    parent.removeChild(child);
}

function replaceElement(parent: HTMLElement, newVNode: VNode | FrontendyComponent | null, index: number) {

    const child = parent.childNodes[index]
    if (!child) {
        return
    }

    if (newVNode instanceof FrontendyComponent) {
        const element = newVNode.mount(parent)
        if (!element) {
            return
        }
        parent.replaceChild(element, child);
        return ;
    }

    parent.replaceChild(createElement(newVNode), child);
}


function updateElement(parent: HTMLElement | Text, 
    oldVNode: FrontendyComponent | VNode | null, 
    newVNode: FrontendyComponent | VNode | null, index = 0) {

    if (parent instanceof Text) {
        if (newVNode instanceof VText) {
            if (newVNode.value !== parent.nodeValue) {
                parent.nodeValue = newVNode.value;
            }
        } else if (newVNode instanceof VElem){
            parent.replaceWith(createElement(newVNode));
        }
        return
    }

    if (!oldVNode && !newVNode) {
        return
    }

    if (!oldVNode && newVNode) {
        addNewElement(parent, newVNode);
        return
    }

    if (!newVNode && oldVNode) {
        removeNewElement(parent, index);
        return
    }

    const newIsText = newVNode instanceof VText;
    const oldIsText = oldVNode instanceof VText;
    if (newIsText || oldIsText) {
        if (newIsText && oldIsText && newVNode.value !== oldVNode.value) {
            parent.innerText = newVNode.value;
        } else if (newVNode !== oldVNode && newVNode instanceof VElem) {
            parent.replaceWith(createElement(newVNode));
        } else if (newVNode !== oldVNode && newVNode instanceof FrontendyComponent) {
            const elem = newVNode.mount(parent)
            if (elem) {
                parent.replaceWith(elem);
            } else {
                removeNewElement(parent, index);
            }
        }
        return
    }

    const newIsComponent = newVNode instanceof FrontendyComponent;
    const oldIsComponent = oldVNode instanceof FrontendyComponent;
    if (newIsComponent || oldIsComponent) {
        if (newIsComponent && oldIsComponent ) {

            const parentParent = parent.parentElement;
            if (!parentParent) {
                return
            }
            newVNode.mount(parentParent)
            oldVNode.unmount();
        } else {
            addNewElement(parent, newVNode);
        }
        return ;
    }

    if (newVNode && oldVNode && newVNode.tag !== oldVNode.tag) {
        replaceElement(parent, newVNode, index);
        return
    }
    
    // Update props
    if (!(parent.childNodes && parent.childNodes.length && oldVNode && newVNode)) {
        return
    }


    for (const key in oldVNode.props) {
        if (!(key in newVNode.props!)) {
            parent.removeAttribute(key);
        }
    }

    for (const key in newVNode.props) {
        if (oldVNode.props?.[key] !== newVNode.props[key]) 
        {
            parent.setAttribute(key, newVNode.props[key]);
        }
    }

    for (let i = 0; i < newVNode.children!.length || i < oldVNode.children!.length; i++) {
        
        const newParent = parent.childNodes[i] as HTMLElement;
        const oldChild = oldVNode.children?.[i];
        const newChild = newVNode.children?.[i];

        updateElement(newParent, oldChild, newChild, i);
    }
}

export default updateElement;