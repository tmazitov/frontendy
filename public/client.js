// src/pkg/frontendy/app/app.ts
var FrontendyAppInstance = class {
  constructor(component) {
    this.rootComponent = component;
  }
  mount(rootNode) {
    const instance = new this.rootComponent();
    instance.mount(rootNode);
  }
};

// src/pkg/frontendy/router/router.ts
var RouterConfig = class {
  constructor() {
    this.NotFoundPage = void 0;
  }
};
var FrontendyRouter = class {
  constructor(routes2, config = void 0) {
    this.routes = [];
    this.config = config ?? new RouterConfig();
    this.routes = routes2;
    this.currentRoute = this.findRoute(window.location.pathname);
    document.addEventListener("click", this.handleLinkClick.bind(this));
    window.addEventListener("popstate", () => this.setCurrentRoute());
  }
  setRouterView(routerView) {
    this.routerView = routerView;
  }
  findRoute(path) {
    return this.routes.find((route) => route.path === path);
  }
  getUndefinedMessageComponent() {
    return this.config?.NotFoundPage;
  }
  handleLinkClick(event) {
    const target = event.target;
    if (target.tagName === "A") {
      const anchor = target;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/")) {
        event.preventDefault();
        window.history.pushState({}, "", href);
        this.setCurrentRoute();
      }
    }
  }
  setCurrentRoute() {
    if (!this.routerView) {
      throw new Error("Router error : routerView instance is not set");
    }
    this.routerView.updateCurrentRoute();
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
      el.appendChild(child.mount(el));
    } else {
      el.appendChild(createElement(child));
    }
  });
  return el;
}
var createElement_default = createElement;

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

// src/pkg/frontendy/vdom/updateElement.ts
function addNewElement(parent, newVNode) {
  if (newVNode instanceof component_default) {
    newVNode.mount(parent);
  } else {
    parent.appendChild(createElement_default(newVNode));
  }
}
function removeNewElement(parent, index) {
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
  if (newVNode instanceof component_default) {
    const element = newVNode.mount(parent);
    if (!element) {
      console.log("after render component no element in replace...");
      return;
    }
    parent.replaceChild(element, child);
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
    } else if (newVNode instanceof VElem_default) {
      parent.replaceWith(createElement_default(newVNode));
    }
    return;
  }
  if (!oldVNode && !newVNode) {
    return;
  }
  if (!oldVNode && newVNode) {
    addNewElement(parent, newVNode);
    return;
  }
  if (!newVNode && oldVNode) {
    removeNewElement(parent, index);
    return;
  }
  const newIsText = newVNode instanceof VText_default;
  const oldIsText = oldVNode instanceof VText_default;
  if (newIsText || oldIsText) {
    if (newIsText && oldIsText && newVNode.value !== oldVNode.value) {
      parent.innerText = newVNode.value;
    } else if (newVNode !== oldVNode && newVNode instanceof VElem_default) {
      parent.replaceWith(createElement_default(newVNode));
    } else if (newVNode !== oldVNode && newVNode instanceof component_default) {
      const elem2 = newVNode.mount(parent);
      if (elem2) {
        parent.replaceWith(elem2);
      } else {
        removeNewElement(parent, index);
        console.log("after render component no element...");
      }
    }
    return;
  }
  const newIsComponent = newVNode instanceof component_default;
  const oldIsComponent = oldVNode instanceof component_default;
  if (newIsComponent || oldIsComponent) {
    if (newIsComponent && oldIsComponent) {
      if (newVNode.componentName !== oldVNode.componentName) {
        console.log("UPD_ELEM : 2 different components", newVNode.componentName, "and", oldVNode.componentName);
      } else {
        console.log("UPD_ELEM : 2 same components ", newVNode.componentName);
      }
      const parentParent = parent.parentElement;
      if (!parentParent) {
        console.log("UPD_ELEM : parentParent is null", parent);
        return;
      }
      console.log("UPD_ELEM : before replace", parentParent);
      newVNode.mount(parentParent);
      oldVNode.unmount();
      console.log("UPD_ELEM : after replace", parentParent);
    } else {
      addNewElement(parent, newVNode);
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
var FrontendyComponent = class {
  constructor(props = {}) {
    this.componentName = getComponentUniqueName();
    // State
    this.oldVNode = null;
    this.isMounted = false;
    this.el = null;
    this.state = {};
    this.props = {};
    this.initProps(props);
    this.initData();
  }
  initData() {
    this.script();
    this.state = this.createState();
  }
  initProps(props = {}) {
    this.props = props;
    console.log("Component props : ", this.props);
  }
  data() {
    return {};
  }
  print() {
    console.log("Component : ", this.componentName);
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
  onUpdated() {
  }
  onUnmounted() {
  }
  mount(target) {
    this.oldVNode = this.template() ?? null;
    if (!this.oldVNode) {
      this.el = null;
      return;
    }
    this.el = this.oldVNode.createHTMLElement();
    console.log(`Rendered node : ${this.componentName}`, this.oldVNode);
    target.appendChild(this.el);
    console.log("Rendered node elem : ", this.el);
    if (!this.isMounted) {
      this.onMounted();
    } else {
      this.onUpdated();
    }
    this.isMounted = true;
    return this.el;
  }
  unmount() {
    console.log("Unmount component : ", this.componentName);
    console.log("Unmount state : isMounted", this.isMounted);
    console.log("Unmount state : el", this.el);
    if (!this.el || !this.isMounted) {
      return;
    }
    const parent = this.el.parentElement;
    if (parent) {
      parent.removeChild(this.el);
    }
    this.el = null;
    this.oldVNode = null;
    this.isMounted = false;
    this.onUnmounted();
  }
  update() {
    console.log("Update component : ", this.componentName);
    console.log("Update state : isMounted", this.isMounted);
    console.log("Update state : el", this.el);
    if (!this.isMounted || !this.el) {
      return;
    }
    const newVNode = this.template();
    if (!newVNode) {
      return;
    }
    console.log(newVNode);
    console.log("New node : ", newVNode);
    console.log("Old node : ", this.oldVNode);
    updateElement_default(this.el, this.oldVNode, newVNode);
    this.oldVNode = newVNode;
  }
  getIsMounted() {
    return this.isMounted;
  }
};
var component_default = FrontendyComponent;

// src/pkg/frontendy/vdom/constructor.ts
function elem(tag) {
  return new VElem_default(tag);
}
function text(value) {
  return new VText_default(value);
}

// src/components/ConterComponent.ts
var CounterComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "counter-component";
  }
  data() {
    return {
      count: 0
    };
  }
  template() {
    return elem("div").setProps({ id: "counter-component" }).setChild([
      elem("h1").addChild(text(`Count: ${this.state.count}`)),
      elem("button").setProps({ id: "increment-button" }).addChild(text("Increment")).addEventListener("click", this.increment.bind(this))
    ]);
  }
  increment() {
    this.state.count++;
  }
};

// src/pages/AboutPage.ts
var AboutPage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "about-page";
  }
  data() {
    return {
      title: "About Us",
      description: "Example text about us."
    };
  }
  template() {
    return elem("div").setProps({ id: "about-page" }).setChild([
      elem("h1").addChild(text(this.state.title)),
      elem("p").addChild(text(this.state.description)),
      new CounterComponent()
    ]);
  }
};

// src/pages/HomePage.ts
var HomePage = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "home-page";
  }
  data() {
    return {
      title: "Welcome to Frontendy",
      description: "This is a simple example of a Frontendy component."
    };
  }
  template() {
    return elem("div").setProps({ id: "home-page" }).setChild([
      elem("h1").addChild(text(this.state.title)),
      elem("p").addChild(text(this.state.description)),
      new CounterComponent()
    ]);
  }
};

// src/pages/NotFoundPage.ts
var NotFoundPage = class extends component_default {
  static {
    this.componentName = "not-found-page";
  }
  data() {
    return {
      message: "404 Not Found"
    };
  }
  template() {
    return elem("div").setProps({ id: "not-found-page" }).setChild([
      elem("h1").addChild(text(this.state.message)),
      elem("p").addChild(text("The page you are looking for does not exist."))
    ]);
  }
};

// src/pages/router.ts
var routes = [
  { name: "home", path: "/home", component: HomePage },
  { name: "about", path: "/about", component: AboutPage }
];
var routerConfig = {
  NotFoundPage
};
var router = new FrontendyRouter(routes, routerConfig);
var router_default = router;

// src/pkg/frontendy/router/RouterView.ts
var FrontendyRouterView = class extends component_default {
  constructor(router2) {
    super({ router: router2 });
    this.componentName = "router-view";
    router2.setRouterView(this);
  }
  data() {
    return {
      currentRoute: this.calcCurrentRoute()
    };
  }
  calcCurrentRoute() {
    const currentUrl = window.location.pathname;
    return this.props.router.findRoute(currentUrl);
  }
  updateCurrentRoute() {
    this.state.currentRoute = this.calcCurrentRoute();
  }
  template() {
    const renderComponentType = this.state.currentRoute !== void 0 ? this.state.currentRoute.component : this.props.router.getUndefinedMessageComponent();
    if (renderComponentType === void 0) {
      throw new Error("RouterView error : No component found for the current route.");
    }
    return elem("div").setProps({ id: "router-view" }).setChild([
      new renderComponentType()
    ]);
  }
};

// src/components/AppComponent.ts
var AppComponent = class extends component_default {
  constructor() {
    super(...arguments);
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
      elem("h1").addChild(text("Hello, from AppComponent!")),
      elem("p").addChild(text("There will be router below...")),
      elem("a").setProps({ href: "/home" }).addChild(text("Home")),
      elem("a").setProps({ href: "/about" }).addChild(text("About")),
      new FrontendyRouterView(router_default)
    ]);
  }
};

// src/client.ts
console.log("I am client.ts");
var rootElem = document.querySelector("body");
if (!rootElem) {
  throw new Error("Client error : root id not found");
}
var appInstance = new FrontendyAppInstance(AppComponent);
appInstance.mount(rootElem);
