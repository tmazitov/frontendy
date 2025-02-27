type VNode = {
    tag: string; // Название тега ("div", "span", "button")
    props?: Record<string, any>; // Атрибуты { class: "btn", id: "main" }
    children?: (VNode | string)[]; // Дети: вложенные VNodes или строки
};



export default VNode;