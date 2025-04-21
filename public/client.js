// src/pkg/frontendy/app/app.ts
var FrontendyAppInstance = class {
  constructor(component) {
    this.rootComponent = component;
  }
  mount(rootNode) {
    const instance = new this.rootComponent();
    instance.render(rootNode);
  }
};

// src/pkg/frontendy/vdom/VText.ts
var VText = class {
  constructor(value) {
    this.value = "";
    this.value = `${value}`;
  }
  print(level = 0) {
    console.log(`${"-".repeat(level)}> ${this.value}`);
  }
};
var VText_default = VText;

// src/pkg/frontendy/vdom/createElement.ts
function createElement(node) {
  if (!node) {
    return document.createElement("noscript");
  }
  if (node instanceof VText_default) {
    return document.createTextNode(node.value);
  }
  const el = document.createElement(node.tag);
  if (node.props) {
    for (const key in node.props) {
      el.setAttribute(key, node.props[key]);
    }
  }
  if (node.styles) {
    const styles = el.style;
    for (const key in node.styles) {
      if (key in styles && node.styles[key]) {
        styles[key] = node.styles[key];
      }
    }
  }
  if (node.events) {
    for (const eventName in node.events) {
      el.addEventListener(eventName, node.events[eventName]);
    }
  }
  node.children?.forEach((child) => {
    if (child instanceof component_default) {
      el.appendChild(child.render(el));
    } else {
      el.appendChild(createElement(child));
    }
  });
  return el;
}
var createElement_default = createElement;

// src/pkg/frontendy/vdom/updateElement.ts
function addNewElement(parent, newVNode, index) {
  parent.appendChild(createElement_default(newVNode));
}
function removeNewElement(parent, oldVNode, index) {
  const child = parent.childNodes[index];
  if (!child) {
    console.log("update vdom erorr: child with index ", index, "not found in parent", parent);
    return;
  }
  parent.removeChild(child);
}
function replaceElement(parent, newVNode, index) {
  const child = parent.childNodes[index];
  if (!child) {
    console.log("update vdom erorr: child with index ", index, "not found in parent", parent);
    return;
  }
  parent.replaceChild(createElement_default(newVNode), child);
}
function updateElement(parent, oldVNode, newVNode, index = 0) {
  if (parent instanceof Text) {
    if (newVNode instanceof VText_default) {
      if (newVNode.value !== parent.nodeValue) {
        parent.nodeValue = newVNode.value;
      }
    } else {
      parent.replaceWith(createElement_default(newVNode));
    }
    return;
  }
  if (!oldVNode && !newVNode) {
    return;
  }
  if (!oldVNode && newVNode) {
    addNewElement(parent, newVNode, index);
    return;
  }
  if (!newVNode && oldVNode) {
    removeNewElement(parent, oldVNode, index);
    return;
  }
  if (newVNode instanceof VText_default || oldVNode instanceof VText_default) {
    if (newVNode instanceof VText_default && oldVNode instanceof VText_default && newVNode.value !== oldVNode.value) {
      parent.innerText = newVNode.value;
    } else if (newVNode !== oldVNode) {
      parent.replaceWith(createElement_default(newVNode));
    }
    return;
  }
  if (newVNode && oldVNode && newVNode.tag !== oldVNode.tag) {
    replaceElement(parent, newVNode, index);
    return;
  }
  if (!(parent.childNodes && parent.childNodes.length && oldVNode && newVNode)) {
    return;
  }
  for (const key in oldVNode.props) {
    if (!(key in newVNode.props)) {
      parent.removeAttribute(key);
    }
  }
  for (const key in newVNode.props) {
    if (oldVNode.props?.[key] !== newVNode.props[key]) {
      parent.setAttribute(key, newVNode.props[key]);
    }
  }
  for (let i = 0; i < newVNode.children.length || i < oldVNode.children.length; i++) {
    const newParent = parent.childNodes[i];
    const oldChild = oldVNode.children?.[i];
    const newChild = newVNode.children?.[i];
    updateElement(newParent, oldChild, newChild, i);
  }
}
var updateElement_default = updateElement;

// src/pkg/frontendy/component/name.ts
function getCounter() {
  let count = 0;
  return {
    getValue: () => ++count
  };
}
var counter = getCounter();
function getComponentUniqueName() {
  const id = counter.getValue();
  return "component-" + id;
}

// src/pkg/frontendy/component/component.ts
var FrontendyComponent = class _FrontendyComponent {
  constructor() {
    // State
    this.oldVNode = null;
    this.el = null;
    this.state = this.createState();
  }
  static {
    this.componentName = getComponentUniqueName();
  }
  static {
    this.components = [];
  }
  static {
    this.methods = {};
  }
  data() {
    return {};
  }
  print() {
    console.log("Component : ", _FrontendyComponent.componentName);
  }
  createState() {
    const initialState = this.data();
    return new Proxy(initialState, {
      set: (target, prop, value) => {
        target[prop] = value;
        console.log(`\u{1F504} State \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D: ${String(prop)} \u2192 ${value}`);
        this.update();
        return true;
      }
    });
  }
  script() {
  }
  template() {
    return void 0;
  }
  onMounted() {
  }
  onUnmounted() {
  }
  render(target) {
    this.oldVNode = this.template() ?? null;
    if (!this.oldVNode) {
      this.el = null;
      return;
    }
    this.el = this.oldVNode.createHTMLElement();
    console.log("Rendered node : ", this.oldVNode);
    target.appendChild(this.el);
    this.onMounted();
    return this.el;
  }
  update() {
    console.log("el", this.el);
    if (!this.el) {
      this.render(document.body);
      return;
    }
    const newVNode = this.template();
    if (!newVNode) {
      return;
    }
    console.log(newVNode);
    console.log("New node : ");
    newVNode.print();
    console.log("Old node : ");
    this.oldVNode?.print();
    updateElement_default(this.el, this.oldVNode, newVNode);
    this.oldVNode = newVNode;
  }
};
var component_default = FrontendyComponent;

// src/pkg/frontendy/vdom/VElem.ts
var VElem = class {
  constructor(tag) {
    this.props = {};
    this.children = [];
    this.show = true;
    this.styles = {};
    this.events = {};
    this.tag = tag;
  }
  setProps(props) {
    this.props = props;
    return this;
  }
  getProps() {
    return this.props;
  }
  setChild(child) {
    const filtered = child.filter((c) => c != null);
    this.children.push(...filtered);
    return this;
  }
  addChild(child) {
    this.children.push(child);
    return this;
  }
  addEventListener(event, callback) {
    if (!event || !callback) {
      throw new Error("event and callback are required");
    }
    this.events[event] = callback;
    return this;
  }
  createHTMLElement() {
    return createElement_default(this);
  }
  print(level = 0) {
    const props = Object.keys(this.props).map((key) => `${key}="${this.props[key]}"`);
    console.log(`${"-".repeat(level)}> ${this.tag} with ${props}`);
    this.children.forEach((child) => {
      child.print(level + 2);
    });
  }
  $vif(conditionResult) {
    if (!conditionResult) {
      this.styles.display = "none";
    } else {
      this.styles.display = null;
    }
    return this;
  }
};
var VElem_default = VElem;

// src/pkg/frontendy/vdom/constructor.ts
function elem(tag) {
  return new VElem_default(tag);
}
function text(value) {
  return new VText_default(value);
}

// src/components/AppComponent.ts
var AppComponent = class extends component_default {
  static {
    this.componentName = "app-container";
  }
  data() {
    return {
      value: "value"
    };
  }
  valueLength() {
    return `${this.state.value.length}`;
  }
  valueInput(ev) {
    console.log("valueInput", this);
  }
  factCheck() {
    console.log("factCheck", this.state.value);
    return this.state.value.length > 10;
  }
  onMounted() {
    if (!this.el || this.el instanceof Text)
      return;
    console.log("mounted", this.state.value);
    this.el.querySelector("input")?.addEventListener("input", (ev) => {
      this.state.value = ev.target.value;
    });
  }
  onUnmounted() {
    if (!this.el || this.el instanceof Text)
      return;
    this.el.querySelector("input")?.removeEventListener("input", this.valueInput);
  }
  template() {
    return elem("div").setProps({ id: "app" }).setChild([
      elem("h1").addChild(text("Hello, World!")),
      elem("p").addChild(text(this.valueLength())),
      elem("p").setChild([
        text(`Brother : ${this.state.value}`),
        elem("br"),
        text(`Sister : ${this.state.value}`)
      ]),
      elem("input").setProps({ id: "test", value: this.state.value }),
      elem("button").setProps({ onclick: () => console.log("Hello, World!") }).addChild(text("Click me!"))
    ]);
  }
};

// src/client.ts
console.log("I am client.ts");
var rootElem = document.getElementById("app");
if (!rootElem) {
  throw new Error("Client error : root id not found");
}
var appInstance = new FrontendyAppInstance(AppComponent);
appInstance.mount(rootElem);
