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
    return;
  }
  parent.removeChild(child);
}
function replaceElement(parent, newVNode, index) {
  const child = parent.childNodes[index];
  if (!child) {
    return;
  }
  if (newVNode instanceof component_default) {
    const element = newVNode.mount(parent);
    if (!element) {
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
      const parentParent = parent.parentElement;
      if (!parentParent) {
        return;
      }
      newVNode.mount(parentParent);
      oldVNode.unmount();
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

// src/pkg/event-broker/eventBroker.ts
var EventBroker = class _EventBroker {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_EventBroker.instance) {
      _EventBroker.instance = new _EventBroker();
    }
    return _EventBroker.instance;
  }
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, callback);
    }
  }
  off(event) {
    if (this.listeners.has(event)) {
      this.listeners.delete(event);
    }
  }
  emit(event, ...args) {
    if (this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      if (callback) {
        callback(...args);
      }
    } else {
      console.warn(`EventBroker warn : no listener for event: ${event}`);
    }
  }
};

// src/pkg/game-launcher/gameSercher.ts
var GameSearcher = class {
  static {
    this.searchGameType = null;
  }
  static {
    this.isConfirmed = false;
  }
  static startGameSearching(game, callback = null) {
    setTimeout(() => {
      EventBroker.getInstance().emit("activate-search-game-bar", game);
      this.searchGameType = game;
      if (callback) {
        callback();
      }
      setTimeout(() => {
        this.foundGame();
      }, 5e3);
    }, 2e3);
  }
  static foundGame() {
    EventBroker.getInstance().emit("deactivate-search-game-bar");
    EventBroker.getInstance().emit("activate-confirmation-modal", this.searchGameType);
  }
  static stopGameSearching() {
    this.searchGameType = null;
    EventBroker.getInstance().emit("deactivate-search-game-bar");
  }
  static confirmGame(callback = null) {
    if (!this.searchGameType) {
      return;
    }
    setTimeout(() => {
      this.isConfirmed = true;
      if (callback) {
        callback();
      }
    }, 200);
  }
  static cancelGame(callback = null) {
    if (!this.searchGameType) {
      return;
    }
    EventBroker.getInstance().emit("deactivate-confirmation-modal");
    setTimeout(() => {
      const isWasConfirmed = this.isConfirmed;
      this.isConfirmed = false;
      if (callback) {
        callback();
      }
      console.log("Game cancelled", isWasConfirmed);
      if (!this.searchGameType) {
        return;
      }
      const game = this.searchGameType;
      this.searchGameType = null;
      if (isWasConfirmed) {
        this.startGameSearching(game);
      }
    }, 200);
  }
  static getMatchPlayer() {
    if (!this.isConfirmed || !this.searchGameType) {
      return [];
    }
    const numberOfPlayers = this.searchGameType.players;
    const players = Array.from({ length: numberOfPlayers }, (_, index) => index + 1).map((player) => {
      return {
        id: player,
        status: "waiting"
      };
    });
    players[0].status = "confirmed";
    return players;
  }
};

// src/layout/loading/LoadingLayout.ts
var LoadingLayout = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "loading-layout";
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
    return elem("div").$vif(this.state.show).setProps({ class: "absolute top-0 left-0 w-full h-full flex items-center justify-center" }).setChild([
      elem("div").setProps({ class: "absolute z-1 top-0 left-0 w-full h-full bg-gray-200 opacity-50" }),
      elem("div").setProps({ class: "absolute z-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center" }).setChild([
        elem("i").setProps({ class: `${this.props.icon} text-xl text-blue-500 animate-spin` }),
        elem("p").setProps({ class: "text-gray-700 mt-2" }).addChild(text(this.props.label))
      ])
    ]);
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
    const headerComp = elem("div").$vif(header !== null).setProps({ class: "px-6 py-4 flex gap-4 items-center " });
    if (this.props.opts.onClose) {
      const closeHandler = onCloseFuncion ? onCloseFuncion.bind(this) : void 0;
      headerComp.addChild(new ModalLayoutCloseButton(closeHandler));
    }
    headerComp.addChild(header);
    return elem("div").$vif(this.state.show).setProps({ class: `fixed top-0 left-0 z-10 flex items-center` }).setChild([
      // Backdrop (outside click --> close)
      backdrop,
      // Modal Window (with header and body slots)
      elem("div").setProps({ class: ` ${cardSize} ${cardPos}  overflow-hidden` }).setChild([
        // Header
        headerComp,
        // Body
        elem("div").setProps({ class: "p-6 pt-0" }).addChild(body),
        // Footer
        elem("div").$vif(footer !== null).setProps({ class: "p-6 pt-0" }).addChild(footer)
      ])
    ]);
  }
};

// src/types/Game.ts
var Game = class {
  constructor(id, name, description, players, icon) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.players = players;
    this.icon = icon;
  }
};

// src/data/games.ts
var games = [
  new Game(0, "Training", "Fight against a bot to train your skills.", 1, "ti ti-robot"),
  new Game(1, "Duel", "Face off against another player in a 1v1 duel.", 2, "ti ti-users"),
  new Game(2, "Turnament", "Become the target of everyone and prove you're the king of the hill.", 8, "ti ti-tournament")
];
var games_default = games;

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
var GameDescriptionComponent = class extends component_default {
  constructor(game) {
    super({ game });
    this.componentName = "game-description-component";
  }
  template() {
    const description = this.props.game.description;
    const number = this.props.game.players;
    const name = this.props.game.name;
    return elem("span").setChild([
      elem("div").setProps({ class: "flex gap-2 mt-4" }).setChild([
        elem("h4").setProps({ class: "text-lg font-semibold text-gray-800" }).addChild(text(name)),
        new TagComponent({
          label: `${number} player${number > 1 ? "s" : ""}`,
          color: "blue",
          icon: "ti ti-users"
        })
      ]),
      elem("p").setProps({ class: "text-sm text-gray-600 mt-2 max-w-xs" }).addChild(text(description))
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
      elem("i").setProps({ class: this.props.game.icon }),
      elem("p").setProps({ class: "text-sm mt-2" }).addChild(text(this.props.game.name))
    ]).addEventListener("click", () => {
      this.props.onClick(this.props.game.id);
    });
  }
};

// src/components/content/game-launch-modal-content/BodyComponent.ts
var GameLauchBodyComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "game-launch-body";
  }
  data() {
    return {
      selectedOption: PreferModeStorage.get() ?? 0
    };
  }
  updateSelectedOption(gameId) {
    if (this.state.selectedOption === gameId) {
      return;
    }
    this.state.selectedOption = gameId;
    PreferModeStorage.save(gameId);
  }
  template() {
    return elem("div").setChild([
      elem("div").setProps({ class: "flex flex-row gap-4 mt-4" }).setChild([
        ...games_default.map((option, index) => {
          return new GameOptionComponent({
            game: option,
            isSelected: this.state.selectedOption === index,
            onClick: this.updateSelectedOption.bind(this)
          });
        })
      ]),
      elem("hr").setProps({ class: "my-4 border-gray-300" }),
      new GameDescriptionComponent(games_default[this.state.selectedOption]),
      new GameCurrentRatingComponent(1e3 - 7),
      new ButtonComponent({
        label: "Find Game",
        type: "primary"
      }).onClick(() => this.props.onSubmit(games_default[this.state.selectedOption]))
    ]);
  }
};

// src/components/modals/GameLauncherModal.ts
var GameLauncherModal = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "game-launch-modal";
  }
  data() {
    return {
      show: false,
      isLoading: false
    };
  }
  setShow(value) {
    this.state.show = value;
    return this;
  }
  onSubmit(game) {
    this.state.isLoading = true;
    GameSearcher.startGameSearching(game, () => {
      this.state.show = false;
      this.state.isLoading = false;
    });
  }
  template() {
    return elem("span").setChild([
      new ModalLayout("game-launch-modal", {
        onClose: () => this.state.show = false,
        customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
      }).setShow(this.state.show).setSlot(
        "header",
        elem("h2").setProps({ class: "text-lg font-bold" }).addChild(text("Game Launcher"))
      ).setSlot(
        "body",
        elem("span").setChild([
          new LoadingLayout({
            label: "Please wait...",
            icon: "ti ti-loader"
          }).setShow(this.state.isLoading),
          new GameLauchBodyComponent({
            onSubmit: this.onSubmit.bind(this)
          })
        ])
      )
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
  onOpenModal() {
    GameSearcher.stopGameSearching();
    this.state.showGameLaunchModal = true;
  }
  template() {
    return elem("span").setChild([
      elem("button").setProps({
        class: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
      }).addEventListener("click", this.onOpenModal.bind(this)).addChild(text("Play")),
      new GameLauncherModal().setShow(this.state.showGameLaunchModal)
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

// src/components/search-game-bar/CancelButtonComponent.ts
var CancelButtonComponent = class extends component_default {
  constructor(props) {
    super(props);
    this.componentName = "cancel-button-component";
  }
  template() {
    return elem("div").setProps({ class: "w-6 h-6 flex justify-center items-center transition duration-300 hover:bg-red-200 active:bg-red-300 rounded-full cursor-pointer" }).setChild([
      elem("i").setProps({ class: "ti ti-x text-red-500 text-md" })
    ]).addEventListener("click", this.props.onClick);
  }
};

// src/pkg/timer.ts
var Timer = class {
  constructor() {
    this.interval = void 0;
    this.counter = 0;
    this.isCounting = false;
  }
  start(omChange) {
    if (this.isCounting) {
      return;
    }
    this.isCounting = true;
    this.counter = 0;
    this.interval = setInterval(() => {
      this.counter++;
      omChange(this.counter);
    }, 1e3);
  }
  stop() {
    if (!this.isCounting) {
      return;
    }
    this.isCounting = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = void 0;
    }
  }
  reset() {
    this.counter = 0;
  }
};
var TimerStorage = class {
  static {
    this.timers = /* @__PURE__ */ new Map();
  }
  static addTimer(name, onChange) {
    if (this.timers.has(name)) {
      throw new Error(`Timer with name ${name} already exists`);
    }
    const timer = new Timer();
    this.timers.set(name, timer);
    timer.start(onChange);
    return timer;
  }
  static removeTimer(name) {
    const timer = this.timers.get(name);
    if (timer) {
      timer.stop();
      this.timers.delete(name);
    }
  }
  static closeAll() {
    this.timers.forEach((timer) => {
      timer.stop();
    });
    this.timers.clear();
  }
};
var timer_default = TimerStorage;

// src/components/search-game-bar/ElapsedTimeComponent.ts
var ElapsedTimeComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "elapsed-time-component";
  }
  data() {
    return {
      elapsedTime: "0:00"
    };
  }
  setCounting(isCounting) {
    if (this.state.isCounting == isCounting) {
      return this;
    }
    if (isCounting) {
      timer_default.addTimer("game-search-bar", (counter2) => {
        const minutes = Math.floor(counter2 / 60);
        const seconds = counter2 % 60;
        this.state.elapsedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      });
    }
    return this;
  }
  template() {
    return elem("p").setChild([
      text(this.state.elapsedTime)
    ]);
  }
};

// src/components/search-game-bar/SearchGameBarComponent.ts
var SearchGameBarComponent = class extends component_default {
  constructor() {
    super(...arguments);
    this.componentName = "find-game-bar-component";
  }
  data() {
    return {
      show: false,
      searchGame: null
    };
  }
  setSearchGame(game) {
    if (this.state.searchGame == game) {
      return this;
    }
    this.state.searchGame = game;
    this.state.show = !!this.state.searchGame;
    return this;
  }
  onCancel() {
    console.log("Cancel button clicked, stopping the game search.");
    GameSearcher.stopGameSearching();
  }
  template() {
    const position = `fixed left-0 bottom-0 w-full h-20 bg-gray-200 flex items-center justify-center`;
    const toast = "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white py-2 px-4";
    return elem("div").$vif(this.state.show).setProps({ class: `${position} z-5` }).setChild([
      elem("div").setProps({ class: `${toast} flex gap-4 justify-between` }).setChild([
        elem("div").setProps({ class: "flex gap-4 items-center" }).setChild([
          new ElapsedTimeComponent().setCounting(this.state.show),
          elem("p").setProps({ class: "text-gray-700" }).addChild(text(this.state.searchGame?.name)),
          elem("p").setProps({ class: "text-gray-700" }).addChild(text("Searching for a game..."))
        ]),
        new CancelButtonComponent({
          onClick: this.onCancel.bind(this)
        })
      ])
    ]);
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

// src/components/content/game-confirmation-modal-content/GameConfirmationComponent.ts
var GameConfirmationComponent = class extends component_default {
  constructor(remainingTime, onSubmit) {
    super({ onSubmit, remainingTime });
    this.componentName = "confirm-view-component";
  }
  template() {
    return elem("div").setProps({ class: "w-full h-full" }).setChild([
      elem("p").setProps({ class: "text-sm text-gray-600 mb-2 text-start" }).addChild(text(`Confirmation time : ${this.props.remainingTime}`)),
      new ButtonComponent({
        label: "Accept",
        type: "primary"
      }).onClick(this.props.onSubmit.bind(this))
    ]);
  }
};

// src/components/content/game-confirmation-modal-content/WaitPlayerBoxComponent.ts
var PlayerBoxComponent = class extends component_default {
  constructor(status) {
    super({ status });
    this.componentName = "player-box-component";
  }
  getBackgroundColor(status) {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "waiting":
        return "bg-gray-300";
      case "missing":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  }
  getBorderColor(status) {
    switch (status) {
      case "confirmed":
        return "border-green-500";
      case "waiting":
        return "border-gray-300";
      case "missing":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  }
  template() {
    const status = this.props.status;
    const borderColor = this.getBorderColor(status);
    const bgColor = this.getBackgroundColor(status);
    return elem("div").setProps({ class: `w-8 h-8 border-2 ${borderColor} ${bgColor} rounded-md flex justify-center items-center` });
  }
};

// src/components/content/game-confirmation-modal-content/GameWaitComponent.ts
var GameWaitComponent = class extends component_default {
  constructor(remainingTime) {
    super({ remainingTime });
    this.componentName = "game-wait-component";
  }
  template() {
    const confirmed = GameSearcher.getMatchPlayer();
    return elem("span").setChild([
      elem("p").setProps({ class: "text-sm text-gray-600 mb-2 text-start" }).addChild(text(`Remaining time : ${this.props.remainingTime}`)),
      elem("div").setProps({ class: "w-full flex gap-2 justify-center" }).setChild([
        ...confirmed.map((player) => new PlayerBoxComponent(player.status))
      ])
    ]);
  }
};

// src/components/modals/GameConfirmationModal.ts
var GameConfirmationModal = class extends component_default {
  constructor(game) {
    super({ game });
    this.componentName = "game-launch-modal";
  }
  data() {
    return {
      show: false,
      isLoading: false,
      isConfirmed: false,
      delay: 20
    };
  }
  setShow(value) {
    this.state.show = value;
    if (value) {
      timer_default.addTimer("game-confirmation-modal", (counter2) => {
        if (counter2 == 20) {
          GameSearcher.cancelGame(() => {
            this.state.isLoading = false;
            this.state.show = false;
            this.state.isConfirmed = false;
            this.state.delay = 20;
          });
        }
        this.state.delay = 20 - counter2;
      });
    }
    return this;
  }
  onSubmit() {
    this.state.isLoading = true;
    GameSearcher.confirmGame(() => {
      this.state.isLoading = false;
      this.state.isConfirmed = true;
    });
  }
  time(num) {
    const seconds = num < 10 ? "0" + num : num;
    return "0:" + seconds;
  }
  template() {
    const modal = new ModalLayout("game-launch-modal", {
      customClasses: "min-h-20 min-w-[300px] max-w-[400px] rounded-lg shadow-lg bg-white"
    }).setShow(this.state.show);
    const headerText = this.state.isConfirmed ? "Waiting for all confirmations..." : "Found a game!";
    const header = elem("h2").setProps({ class: "text-lg font-semibold text-gray-800" }).addChild(text(headerText));
    modal.setSlot("header", header);
    const remainingTime = this.time(this.state.delay);
    if (this.state.isConfirmed) {
      const body = elem("span").setChild([
        new GameWaitComponent(remainingTime)
      ]);
      modal.setSlot("body", body);
    } else {
      const body = elem("span").setChild([
        new LoadingLayout({
          label: "Please wait...",
          icon: "ti ti-loader"
        }).setShow(this.state.isLoading),
        new GameConfirmationComponent(remainingTime, this.onSubmit.bind(this))
      ]);
      modal.setSlot("body", body);
    }
    return elem("span").addChild(modal);
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
      searchGameType: null,
      showGameConfirmationModal: false
    };
  }
  isNavigatablePage() {
    if (!this.state.currentRoute) {
      return false;
    }
    return this.state.currentRoute.name != "auth";
  }
  onMounted() {
    EventBroker.getInstance().on("activate-search-game-bar", (game) => {
      if (this.state.searchGameType) {
        return;
      }
      this.state.searchGameType = game;
    });
    EventBroker.getInstance().on("deactivate-search-game-bar", () => {
      if (!this.state.searchGameType) {
        return;
      }
      timer_default.removeTimer("game-search-bar");
      this.state.searchGameType = null;
    });
    EventBroker.getInstance().on("activate-confirmation-modal", () => {
      this.state.showGameConfirmationModal = true;
    });
    EventBroker.getInstance().on("deactivate-confirmation-modal", () => {
      timer_default.removeTimer("game-confirmation-modal");
      this.state.showGameConfirmationModal = false;
    });
  }
  onUnmounted() {
    EventBroker.getInstance().off("activate-confirmation-modal");
    EventBroker.getInstance().off("deactivate-confirmation-modal");
    EventBroker.getInstance().off("activate-search-game-bar");
    EventBroker.getInstance().off("deactivate-search-game-bar");
  }
  template() {
    return elem("div").setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800" }).setChild([
      elem("span").$vif(true).addChild(new NavBarComponent(navBarLinks)),
      new FrontendyRouterView(router_default),
      new SearchGameBarComponent().setSearchGame(this.state.searchGameType),
      new GameConfirmationModal(this.state.searchGameType).setShow(this.state.showGameConfirmationModal)
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
