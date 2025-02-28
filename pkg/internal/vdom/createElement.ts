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

    // Add children
    node.children?.forEach(child => {
        el.appendChild(createElement(child));
    });

    return el;
}

export default createElement;