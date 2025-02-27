import VNode from "./VNode";

function createElement(node: VNode|null): HTMLElement {

    if (!node) {
        return document.createElement("noscript");
    }

    const el = document.createElement(node.tag);
  
    // Устанавливаем атрибуты
    if (node.props) {
        for (const key in node.props) {
            el.setAttribute(key, node.props[key]);
        }
    }

    // Добавляем детей
    node.children?.forEach(child => {
        if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
        } else {
            el.appendChild(createElement(child)); // Рекурсия для вложенных элементов
        }
    });

  
    return el;
}

export default createElement;