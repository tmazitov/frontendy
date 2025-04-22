import FrontendyComponent from "../component/component";
import createElement from "./createElement";
import VElem from "./VElem";
import VText from "./VText";


function addNewElement(parent: HTMLElement, newVNode: VElem | VText, index: number) {
    parent.appendChild(createElement(newVNode));  
}

function removeNewElement(parent: HTMLElement, oldVNode: VElem | VText, index: number) {

    const child = parent.childNodes[index]
    if (!child) {
        console.log("update vdom erorr: child with index ", index, "not found in parent", parent)
        return
    }
    parent.removeChild(child);
}

function replaceElement(parent: HTMLElement, newVNode: VElem | VText, index: number) {
    
    const child = parent.childNodes[index]
    if (!child) {
        console.log("update vdom erorr: child with index ", index, "not found in parent", parent)
        return
    }

    parent.replaceChild(createElement(newVNode), child);
}


function updateElement(parent: HTMLElement | Text, oldVNode: VElem | VText | null, newVNode: VElem | VText | null, index = 0) {

    if (parent instanceof Text) {
        if (newVNode instanceof VText) {
            if (newVNode.value !== parent.nodeValue) {
                parent.nodeValue = newVNode.value;
            }
        } else {
            parent.replaceWith(createElement(newVNode));
        }
        return
    }

    if (!oldVNode && !newVNode) {
        return
    }


    if (!oldVNode && newVNode) {
        addNewElement(parent, newVNode, index);
        return
    }

    if (!newVNode && oldVNode) {
        removeNewElement(parent, oldVNode, index);
        return
    }

    if (newVNode instanceof VText || oldVNode instanceof VText) {
        if (newVNode instanceof VText && oldVNode instanceof VText && newVNode.value !== oldVNode.value) {
            parent.innerText = newVNode.value;
        } else if (newVNode !== oldVNode) {
            parent.replaceWith(createElement(newVNode));
        }
        return
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