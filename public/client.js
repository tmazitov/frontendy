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
    this.currentRoute = this.findRoute(window.location.pathname);
    this.routerView.updateCurrentRoute();
  }
  push(name) {
    const route = this.routes.find((route2) => route2.name === name);
    if (!route) {
      throw new Error(`Router error: route ${name} not found`);
    }
    if (route.path === this.currentRoute?.path) {
      throw new Error(`Router error: route ${name} already active`);
    }
    window.history.pushState({}, "", route.path);
    this.setCurrentRoute();
  }
  getCurrentRoute() {
    return this.currentRoute;
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
var VElem = class _VElem {
  constructor(tag) {
    this.props = {};
    this.children = [];
    this.show = true;
    this.styles = {};
    this.events = {};
    this.tag = tag;
  }
  setProps(props) {
    if (!this.props) {
      this.props = props;
      return this;
    }
    Object.keys(props).forEach((key) => {
      this.props[key] = props[key];
    });
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
    if (!child) {
      return this;
    }
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
  $vfor(array, callback) {
    if (!Array.isArray(array)) {
      throw new Error("v-for expects an array");
    }
    return array.map((item) => {
      const newElem = new _VElem(this.tag);
      newElem.setProps(this.props);
      callback(newElem, item);
      return newElem;
    });
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

// src/pkg/frontendy/component/lifecicle.ts
var FrontendyLifecicle = class {
  onMounted() {
  }
  onUpdated() {
  }
  onUnmounted() {
  }
  onCreated() {
  }
};
var lifecicle_default = FrontendyLifecicle;

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

// src/pkg/frontendy/component/slot.ts
var FrontendySlot = class {
  constructor(name) {
    this.value = void 0;
    this.name = name;
  }
  set(value) {
    this.value = value;
  }
  render() {
    return this.value ?? null;
  }
};
var slot_default = FrontendySlot;

// src/pkg/frontendy/component/component.ts
var FrontendyComponent = class extends lifecicle_default {
  constructor(props = {}) {
    super();
    this.componentName = getComponentUniqueName();
    // State
    this.state = {};
    this._props = {};
    this._slots = {};
    // VDOM
    this.oldVNode = null;
    this.isMounted = false;
    this._el = null;
    this.initProps(props);
    this.initState();
    this.initSlots();
    this.onCreated();
  }
  initProps(props = {}) {
    this._props = props;
  }
  initState() {
    const initialState = this.data();
    this.state = new Proxy(initialState, {
      set: (target, prop, value) => {
        target[prop] = value;
        console.log(`\u{1F504} State \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D: ${String(prop)} \u2192 ${value}`);
        this.update();
        return true;
      }
    });
  }
  initSlots() {
    this.slots().forEach((slotName) => {
      this.registerSlot(slotName);
    });
  }
  get props() {
    return this._props;
  }
  get el() {
    return this._el;
  }
  data() {
    return {};
  }
  slots() {
    return [];
  }
  print() {
    console.log("Component : ", this.componentName);
  }
  template() {
    return void 0;
  }
  mount(target) {
    this.oldVNode = this.template() ?? null;
    if (!this.oldVNode) {
      this._el = null;
      return;
    }
    this._el = this.oldVNode.createHTMLElement();
    target.appendChild(this._el);
    if (!this.isMounted) {
      this.onMounted();
    } else {
      this.onUpdated();
    }
    this.isMounted = true;
    return this.el;
  }
  unmount() {
    if (!this.el || !this.isMounted) {
      return;
    }
    const parent = this.el.parentElement;
    if (parent) {
      parent.removeChild(this.el);
    }
    this._el = null;
    this.oldVNode = null;
    this.isMounted = false;
    this.onUnmounted();
  }
  update() {
    if (!this.isMounted || !this.el) {
      return;
    }
    const newVNode = this.template();
    if (!newVNode) {
      return;
    }
    updateElement_default(this.el, this.oldVNode, newVNode);
    this.oldVNode = newVNode;
  }
  registerSlot(name) {
    if (this._slots[name]) {
      return this._slots[name];
    }
    const slot = new slot_default(name);
    this._slots[name] = slot;
    return slot;
  }
  useSlot(name) {
    if (!this._slots[name]) {
      throw new Error(`FrontendyComponent error : slot with name "${name}" does not exist`);
    }
    return this._slots[name].render();
  }
  setSlot(name, value) {
    if (!this._slots[name]) {
      throw new Error(`FrontendyComponent error : slot with name "${name}" does not exist`);
    }
    this._slots[name].set(value);
    return this;
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

// src/components/content/about-page-content/AboutInfoComponent.ts
var AboutInfoComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "home-dashboard-component";
  }
  template() {
    return elem("div").setProps({
      id: "home-dashboard-component",
      class: "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6"
    }).setChild([
      elem("h1").setProps({ class: "text-2xl font-bold mb-4" }).addChild(text(`About us`)),
      elem("p").setProps({ class: "text-gray-700 text-base mb-4" }).addChild(text("ft_transcendence is a project that aims to provide a platform for developers to learn and practice their skills in a collaborative environment.")),
      elem("h2").setProps({ class: "text-xl font-bold mb-2" }).addChild(text("Our team:")),
      elem("ul").setProps({ class: "list-disc list-inside mb-4" }).setChild([
        elem("li").addChild(text("Timur Mazitov - Project Manager")),
        elem("li").addChild(text("Valeria Lomakina - Backend Developer")),
        elem("li").addChild(text("Sofia Abdulkina - Backend Developer")),
        elem("li").addChild(text("Ibrohim Ganiev - Fullstack Developer"))
      ])
    ]);
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
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(new AboutInfoComponent())
    ]);
  }
};

// src/components/inputs/InfoParagraphComponent.ts
var InfoParagraphComponent = class extends component_default {
  constructor(text7) {
    super({ text: text7 });
    this.componentName = "info-paragraph-component";
  }
  template() {
    return elem("p").setProps({ class: "text-gray-700 text-base mb-2" }).addChild(text(this.props.text));
  }
};

// src/layout/modal/ModalLayoutCloseButton.ts
var buttonSize = "w-6 h-6";
var buttonColor = "bg-white hover:bg-gray-100 active:bg-gray-200 rounded-lg ease-in-out duration-200";
var buttonInner = "flex items-center justify-center";
var ModalLayoutCloseButton = class extends component_default {
  constructor(onClick) {
    super({ onClick });
    this.componentName = "modal-layout-close-button";
  }
  template() {
    const button = elem("button").setProps({ class: `${buttonSize} ${buttonColor} ${buttonInner}` }).addChild(elem("i").setProps({ class: "ti ti-x" }));
    if (this.props.onClick) {
      button.addEventListener("click", this.props.onClick.bind(this));
    }
    return button;
  }
};

// src/layout/modal/ModalLayout.ts
var ModalLayout = class extends component_default {
  constructor(name, opts = {}) {
    super({ name, opts });
  }
  data() {
    return {
      show: false
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  slots() {
    return [
      "header",
      "body",
      "footer"
    ];
  }
  template() {
    const header = this.useSlot("header");
    const body = this.useSlot("body");
    const footer = this.useSlot("footer");
    const defaultCardSize = "min-h-20 min-w-20 max-w-80 rounded-lg shadow-lg bg-white";
    const cardSize = this.props.opts.customClasses || defaultCardSize;
    const cardPos = "absolute left-1/2 transform -translate-x-1/2";
    const onCloseFuncion = this.props.opts.onClose;
    const backdrop = elem("div").setProps({ class: "w-dvw h-dvh bg-black opacity-50 " });
    if (this.props.opts.closeOnClickOutside && onCloseFuncion) {
      backdrop.addEventListener("click", () => {
        onCloseFuncion.bind(this)();
      });
    }
    return elem("div").$vif(this.state.show).setProps({ class: `fixed top-0 left-0 z-10 flex items-center` }).setChild([
      // Backdrop (outside click --> close)
      backdrop,
      // Modal Window (with header and body slots)
      elem("div").setProps({ class: ` ${cardSize} ${cardPos}` }).setChild([
        // Header
        elem("div").$vif(header !== null).setProps({ class: "px-6 py-4 flex gap-4 items-center " }).addChild(new ModalLayoutCloseButton(onCloseFuncion ? onCloseFuncion.bind(this) : void 0)).addChild(header),
        // Body
        elem("div").setProps({ class: "p-6 pt-0" }).addChild(body),
        // Footer
        elem("div").$vif(footer !== null).setProps({ class: "p-6 pt-0" }).addChild(footer)
      ])
    ]);
  }
};

// src/pkg/game-launcher/preferedMode.ts
var PreferModeStorage = class {
  static save(modeId) {
    localStorage.setItem("prefered-mode", modeId.toString());
  }
  static get() {
    const modeId = localStorage.getItem("prefered-mode");
    if (!modeId) {
      return null;
    }
    return parseInt(modeId);
  }
};

// src/components/inputs/ButtonComponent.ts
var ButtonComponent = class extends component_default {
  constructor(props) {
    const { label, type } = props;
    super({ label, type });
    this.componentName = "button-component";
  }
  data() {
    return {
      clickHandler: () => {
      }
    };
  }
  onClick(fn) {
    this.state.clickHandler = fn;
    return this;
  }
  getButtonColor() {
    const type = this.props.type || "default";
    switch (type) {
      case "primary":
        return "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white";
      case "default":
        return "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800";
      default:
        return "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800";
    }
  }
  template() {
    const buttonSize2 = "px-4 py-2 rounded-md w-full h-10 text-sm";
    const buttonColor2 = this.getButtonColor();
    const buttonAnime = "transition duration-200 ease-in-out";
    const button = elem("button").addChild(text(this.props.label)).setProps({
      class: `${buttonColor2} ${buttonSize2} ${buttonAnime} flex justify-center items-center`
    });
    if (this.state.clickHandler) {
      button.addEventListener("click", this.state.clickHandler);
    }
    return button;
  }
};

// src/components/content/game-launch-modal-content/GameCurrentRatingComponent.ts
var GameCurrentRatingComponent = class extends component_default {
  constructor(rating) {
    super({ rating });
    this.componentName = "game-current-rating-component";
  }
  template() {
    return elem("p").$vif(this.props.rating).setProps({ class: "text-sm text-gray-500 mt-6 mb-2" }).addChild(text(`Your rating : ${this.props.rating}`));
  }
};

// src/components/inputs/TagComponent.ts
var TagComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "tag-component";
  }
  template() {
    const icon = this.props.icon ? elem("i").setProps({ class: this.props.icon }) : null;
    return elem("div").setProps({
      class: `flex flex-row items-center gap-2 bg-${this.props.color}-100 text-${this.props.color}-800 text-sm font-medium px-2.5 py-0.5 rounded`
    }).setChild([
      icon,
      elem("div").setProps({ class: "" }).addChild(text(this.props.label))
    ]);
  }
};

// src/components/content/game-launch-modal-content/GameDescriptionComponent.ts
var descriptions = [
  "Fight against a bot to train your skills.",
  "Face off against another player in a 1v1 duel.",
  "Become the target of everyone and prove you're the king of the hill."
];
var players = [
  1,
  2,
  8
];
var gameNames = [
  "Training",
  "Duel",
  "Tournament"
];
var GameDescriptionComponent = class extends component_default {
  constructor(gameId) {
    super({ gameId });
    this.componentName = "game-description-component";
  }
  template() {
    const gameId = this.props.gameId;
    const appropriateDescription = descriptions[gameId];
    if (!appropriateDescription) {
      return void 0;
    }
    const appropriateNumber = players[gameId];
    if (!appropriateNumber) {
      return void 0;
    }
    const appropriateGameName = gameNames[gameId];
    if (!appropriateGameName) {
      return void 0;
    }
    return elem("span").setChild([
      elem("div").setProps({ class: "flex gap-2 mt-4" }).setChild([
        elem("h4").setProps({ class: "text-lg font-semibold text-gray-800" }).addChild(text(appropriateGameName)),
        new TagComponent({
          label: `${appropriateNumber} player${appropriateNumber > 1 ? "s" : ""}`,
          color: "blue",
          icon: "ti ti-users"
        })
      ]),
      elem("p").setProps({ class: "text-sm text-gray-600 mt-2 max-w-xs" }).addChild(text(appropriateDescription))
    ]);
  }
};

// src/components/content/game-launch-modal-content/GameOptionComponent.ts
var GameOptionComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "game-option";
  }
  template() {
    const sizeStyles = "w-24 h-24 flex flex-col items-center justify-center rounded-lg";
    const borderStyles = this.props.isSelected ? "border-blue-300" : "border-blue-100";
    const hoverStyles = this.props.isSelected ? "hover:border-blue-400" : "hover:border-blue-300";
    const backgroundStyles = this.props.isSelected ? "bg-blue-100" : "bg-white";
    return elem("div").setProps({
      class: `${sizeStyles} border-2 ${borderStyles} ${hoverStyles} ${backgroundStyles} select-none cursor-pointer  shadow-md transition duration-300`
    }).setChild([
      elem("i").setProps({ class: this.props.icon }),
      elem("p").setProps({ class: "text-sm mt-2" }).addChild(text(this.props.title))
    ]).addEventListener("click", () => {
      this.props.onClick(this.props.id);
    });
  }
};

// src/components/content/game-launch-modal-content/BodyComponent.ts
var gameOptions = [
  { title: "Training", icon: "ti ti-robot" },
  { title: "Duel", icon: "ti ti-users" },
  { title: "Turnament", icon: "ti ti-tournament" }
];
var GameLauchBodyComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "game-launch-body";
  }
  data() {
    return {
      selectedOption: PreferModeStorage.get() ?? 0
    };
  }
  updateSelectedOption(id) {
    if (this.state.selectedOption === id) {
      return;
    }
    this.state.selectedOption = id;
    PreferModeStorage.save(id);
  }
  template() {
    return elem("div").setChild([
      elem("div").setProps({ class: "flex flex-row gap-4 mt-4" }).setChild([
        ...gameOptions.map((option, index) => {
          return new GameOptionComponent({
            id: index,
            title: option.title,
            icon: option.icon,
            isSelected: this.state.selectedOption === index,
            onClick: (id) => {
              if (this.state.selectedOption === id) {
                return;
              }
              this.state.selectedOption = id;
            }
          });
        })
      ]),
      elem("hr").setProps({ class: "my-4 border-gray-300" }),
      new GameDescriptionComponent(this.state.selectedOption),
      new GameCurrentRatingComponent(1e3 - 7),
      new ButtonComponent({
        label: "Find Game",
        type: "primary"
      })
    ]);
  }
};

// src/components/modals/GameModal.ts
var GameLaunchModal = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "game-launch-modal";
  }
  data() {
    return {
      show: false
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  template() {
    return elem("span").setChild([
      new ModalLayout("game-launch-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot(
        "header",
        elem("h2").setProps({ class: "text-lg font-bold" }).addChild(text("Game Launch"))
      ).setSlot("body", new GameLauchBodyComponent())
    ]);
  }
};

// src/components/content/home-page-content/PlayButtonComponent.ts
var PlayButtonComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "play-button-component";
  }
  data() {
    return {
      showGameLaunchModal: false
    };
  }
  template() {
    return elem("span").setChild([
      elem("button").setProps({
        class: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
      }).addEventListener("click", () => this.state.showGameLaunchModal = true).addChild(text("Play")),
      new GameLaunchModal().setShow(this.state.showGameLaunchModal)
    ]);
  }
};

// src/components/content/home-page-content/DashboardComponent.ts
var DashboardComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "home-dashboard-component";
  }
  template() {
    return elem("div").setProps({
      id: "home-dashboard-component",
      class: "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6"
    }).setChild([
      elem("h1").setProps({ class: "text-2xl font-bold mb-4" }).addChild(text(`Home`)),
      new InfoParagraphComponent("Welcome to the ft_transcendence!"),
      new InfoParagraphComponent("There will be some tools and players statistics soon."),
      new PlayButtonComponent()
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
      elem("div").setProps({ class: "flex flex-col items-center p-4 pt-8" }).addChild(new DashboardComponent())
    ]);
  }
};

// src/pages/NotFoundPage.ts
var NotFoundPage = class extends component_default {
  static {
    this.componentName = "not-found-page";
  }
  goHome() {
    router_default.push("home");
  }
  template() {
    return elem("div").setProps({
      id: "not-found-page",
      class: "flex flex-col items-center justify-center h-full w-full p-8"
    }).setChild([
      elem("div").setProps({ class: "flex flex-col gap-4 p-4 rounded-lg max-w-lg w-full bg-white" }).setChild([
        elem("h1").setProps({ class: "text-2xl font-bold text-gray-800" }).addChild(text("404 Oups! Page not found...")),
        elem("p").setProps({ class: "text-gray-600" }).addChild(text("The page you are looking for does not exist.")),
        new ButtonComponent({
          label: "Main page",
          type: "primary"
        }).onClick(this.goHome.bind(this))
      ])
    ]);
  }
};

// src/pages/router.ts
var routes = [
  { name: "home", path: "/", component: HomePage },
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

// src/types/NavBarLink.ts
var NavBarLink = class {
  constructor(label, routeName, icon) {
    this.label = label;
    this.routeName = routeName;
    this.icon = icon;
  }
};

// src/types/forms/registrationForm.ts
var SignUpForm = class {
  constructor(nickname, email, password) {
    this.nickname = nickname;
    this.email = email;
    this.password = password;
  }
  validate() {
    if (!this.nickname || this.nickname.length < 3) {
      return "Nickname must be at least 3 characters long";
    }
    if (!this.email || !this.email.includes("@")) {
      return "Please enter a valid email address";
    }
    if (!this.password || this.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return void 0;
  }
  toSubmit() {
    return {
      nickname: this.nickname,
      email: this.email,
      password: this.password
    };
  }
};

// src/types/forms/signInForm.ts
var SignInForm = class {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email.length || !emailRegex.test(this.email)) {
      return "Invalid email address.";
    }
    if (!this.password.length) {
      return "Password is required.";
    }
    if (this.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
  }
  toSubmit() {
    return {
      email: this.email,
      password: this.password
    };
  }
};

// src/components/inputs/InputLabelComponent.ts
var InputLabelComponent = class extends component_default {
  constructor(label) {
    super({ label });
    this.componentName = "input-label-component";
  }
  template() {
    return elem("div").setProps({ class: "text-gray-700 text-sm" }).addChild(text(this.props.label));
  }
};

// src/components/inputs/InputComponent.ts
var InputComponent = class extends component_default {
  constructor(value, opts = {}) {
    super({ value, opts });
    this.componentName = "input-component";
  }
  data() {
    return {
      inputHandler: null,
      enterHandler: null
    };
  }
  onInput(fn) {
    this.state.inputHandler = fn;
    return this;
  }
  onEnter(fn) {
    this.state.enterHandler = fn;
    return this;
  }
  focus() {
    if (!this.el || this.el instanceof Text) {
      return;
    }
    this.el.focus();
    if (this.el.tagName === "input") {
      this.el.focus();
    } else {
      this.el.querySelector("input")?.focus();
    }
  }
  template() {
    const elemBorder = "border-2 border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ease-in-out duration-200";
    const elemSize = "w-full h-8";
    const input = elem("input").setProps({
      type: this.props.opts.type,
      value: this.props.value,
      class: `p-2 bg-transparent ${elemSize} ${elemBorder}`,
      placeholder: this.props.opts.placeholder ?? ""
    });
    if (this.state.inputHandler) {
      input.addEventListener("input", (event) => {
        const target = event.target;
        this.state.inputHandler(target.value);
      });
    }
    if (this.state.enterHandler) {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.state.enterHandler();
        }
      });
    }
    if (this.props.opts.label) {
      return elem("div").setChild([
        new InputLabelComponent(this.props.opts.label),
        input
      ]);
    }
    return input;
  }
};

// src/components/forms/AuthForm.ts
var AuthForm = class extends component_default {
  constructor(form, onSubmit) {
    super({ form, onSubmit });
    this.componentName = "auth-form";
  }
  data() {
    return {
      form: this.props.form
    };
  }
  submit() {
    this.props.onSubmit(this.state.form);
  }
  onChangePassword(value) {
    this.state.form.password = value;
  }
  onChangeEmail(value) {
    this.state.form.email = value;
  }
  template() {
    const submitButton = new ButtonComponent({ label: "Submit", type: "primary" }).onClick(this.submit.bind(this));
    const passwordInput = new InputComponent(this.state.form.password, {
      type: "password",
      label: "Password"
    }).onInput((value) => this.state.form.password = value).onEnter(this.submit.bind(this));
    const emailInput = new InputComponent(this.state.form.email, {
      type: "email",
      label: "Email"
    }).onInput((value) => this.state.form.email = value).onEnter(() => passwordInput.focus());
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      emailInput,
      passwordInput,
      elem("div").setProps({ class: "mt-2 flex" }).addChild(submitButton)
    ]);
  }
};

// src/components/forms/RegistrationForm.ts
var RegistrationForm = class extends component_default {
  constructor(form, onSubmit) {
    super({ form, onSubmit });
    this.componentName = "registration-form";
  }
  data() {
    return {
      form: this.props.form
    };
  }
  submit() {
    this.props.onSubmit(this.state.form);
  }
  onChangeNickname(value) {
    this.state.form.nickname = value;
  }
  onChangeEmail(value) {
    this.state.form.email = value;
  }
  onChangePassword(value) {
    this.state.form.password = value;
  }
  template() {
    const submitButton = new ButtonComponent({ label: "Submit", type: "primary" }).onClick(this.submit.bind(this));
    const passwordInput = new InputComponent(this.state.form.password, {
      type: "password",
      label: "Password"
    }).onInput((value) => this.state.form.password = value).onEnter(this.submit.bind(this));
    const emailInput = new InputComponent(this.state.form.email, {
      type: "email",
      label: "Email"
    }).onInput((value) => this.state.form.email = value).onEnter(() => passwordInput.focus());
    const nicknameInput = new InputComponent(this.state.form.nickname, {
      type: "text",
      label: "Nickname"
    }).onInput((value) => this.state.form.nickname = value).onEnter(() => emailInput.focus());
    return elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
      nicknameInput,
      emailInput,
      passwordInput,
      elem("div").setProps({ class: "mt-2 flex" }).addChild(submitButton)
    ]);
  }
};

// src/components/modals/AuthModal.ts
var AuthModal = class extends component_default {
  constructor() {
    super();
  }
  data() {
    return {
      show: false,
      isLogin: true,
      errorMessage: "",
      signInForm: new SignInForm("", ""),
      signUpForm: new SignUpForm("", "", "")
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  onSubmit(form) {
    const error = form.validate();
    if (error) {
      this.state.errorMessage = error;
      return;
    }
    this.state.errorMessage = "";
  }
  toggleForm() {
    this.state.isLogin = !this.state.isLogin;
    this.state.errorMessage = "";
  }
  template() {
    const form = this.state.isLogin ? new AuthForm(this.state.signInForm, this.onSubmit.bind(this)) : new RegistrationForm(this.state.signUpForm, this.onSubmit.bind(this));
    const title = this.state.isLogin ? "Sign in" : "Sign up";
    const toggleText = this.state.isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in";
    return elem("span").addChild(
      new ModalLayout("auth-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot(
        "header",
        elem("h2").addChild(text(title)).setProps({ class: "text-xl font-bold text-center" })
      ).setSlot(
        "body",
        elem("div").setProps({ class: "flex flex-col gap-4" }).setChild([
          elem("div").$vif(this.state.errorMessage).setProps({ class: "text-red-500 text-sm text-center" }).addChild(text(this.state.errorMessage)),
          form,
          elem("div").setProps({ class: "text-center mt-2" }).addChild(
            elem("button").setProps({
              class: "text-blue-500 hover:text-blue-700 underline text-sm"
            }).addChild(text(toggleText)).addEventListener("click", this.toggleForm.bind(this))
          )
        ])
      )
    );
  }
};

// src/components/nav-bar/NavBarItemComponent.ts
var NavBarItemComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "nav-bar-item-component";
  }
  getStyles() {
    const styles = {
      animation: "hover:bg-gray-100 active:bg-gray200 duration-200 ease-in-out",
      container: "flex items-center px-4 py-2",
      text: "cursor-pointer text-sm"
    };
    return `nav-link ${styles.container} ${styles.text} ${styles.animation}`;
  }
  template() {
    return elem("div").setProps({ class: this.getStyles() }).setChild([
      elem("i").setProps({ class: this.props.icon }),
      elem("span").setProps({ class: "ml-2" }).addChild(text(this.props.label))
    ]).addEventListener("click", this.props.onClick);
  }
};

// src/components/nav-bar/NavBarComponent.ts
var NavBarComponent = class extends component_default {
  constructor(links) {
    super({ links });
    this.componentName = "nav-bar-component";
  }
  data() {
    return {
      showAuthModal: false
    };
  }
  navigate(link) {
    console.log("navigate", link);
    router_default.push(link.routeName);
  }
  template() {
    return elem("div").setProps({ class: "flex flex-col items-center p-4" }).setChild([
      elem("div").setProps({
        id: "nav-bar",
        class: "max-w-2xl w-full rounded-lg navbar flex flex-row bg-white pr-4 shadow-md"
      }).setChild([
        elem("h1").addChild(text("ft_transcendence")).setProps({ class: "text-l font-bold px-4 py-2" }),
        elem("div").setProps({ class: "flex flex-row justify-between w-full" }).setChild([
          // Main navbar links
          elem("div").setProps({ class: "flex flex-row" }).setChild(this.props.links.map((link) => {
            return new NavBarItemComponent({
              icon: link.icon,
              label: link.label,
              onClick: () => this.navigate(link)
            });
          })),
          // Sign in button
          new NavBarItemComponent({
            icon: "ti ti-login-2",
            label: "Sign in",
            onClick: () => {
              this.state.showAuthModal = true;
            }
          })
        ]),
        // Sign in / up modal window
        new AuthModal().setShow(this.state.showAuthModal)
      ])
    ]);
  }
};

// src/components/AppComponent.ts
var navBarLinks = [
  new NavBarLink("Home", "home", "ti ti-home"),
  new NavBarLink("About", "about", "ti ti-info-circle")
];
var AppComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "app-container";
  }
  data() {
    return {
      currentRoute: router_default.getCurrentRoute(),
      showRegModal: false
    };
  }
  toggleShowModal() {
    this.state.showRegModal = !this.state.showRegModal;
  }
  isNavigatablePage() {
    if (!this.state.currentRoute) {
      return false;
    }
    return this.state.currentRoute.name != "auth";
  }
  template() {
    return elem("div").setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800" }).setChild([
      elem("span").$vif(true).addChild(new NavBarComponent(navBarLinks)),
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
