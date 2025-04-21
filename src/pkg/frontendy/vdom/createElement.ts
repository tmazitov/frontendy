import Component from "../component/component";
import VElem from "./VElem";
import VText from "./VText";

function createElement(node: VElem | VText |null): HTMLElement | Text {

    if (!node) {
        return document.createElement("noscript");
    }

    if (node instanceof VText) {
        return document.createTextNode(node.value);
    }

    const el = document.createElement(node.tag);
  
    // Set attributes
    if (node.props) {
        for (const key in node.props) {
            el.setAttribute(key, node.props[key]);
        }
    }

    if (node.styles) {
        const styles = el.style;
        for (const key in node.styles) {
            if (key in styles && node.styles[key]) {
                (styles as any)[key] = node.styles[key];
            }
        }
    }

    if (node.events) {
        for (const eventName in node.events) {
            el.addEventListener(eventName, node.events[eventName]);
        }
    }

    // Add children
    node.children?.forEach(child => {
        if (child instanceof Component) {
            el.appendChild(child.render(el as HTMLElement) as HTMLElement);
        } else {
            el.appendChild(createElement(child));
        }
    });

    return el;
}

export default createElement;