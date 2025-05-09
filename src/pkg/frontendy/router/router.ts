import FrontendyComponent from "../component/component";
import FrontendyRoute from "./route";
import FrontendyRouterView from "./RouterView";

class RouterConfig {
    NotFoundPage : typeof FrontendyComponent | undefined = undefined;
}

export {
    RouterConfig,
}

export default class FrontendyRouter {

    private routes: FrontendyRoute[] = [];
    private config: RouterConfig ;
    private currentRoute: FrontendyRoute | undefined;
    private routerView: FrontendyRouterView | undefined;

    constructor(routes: FrontendyRoute[], config: RouterConfig | undefined = undefined) {
        this.config = config ?? new RouterConfig();
        this.routes = routes;
        this.currentRoute = this.findRoute(window.location.pathname);

        document.addEventListener("click", this.handleLinkClick.bind(this));
        window.addEventListener("popstate", () => this.setCurrentRoute());
    }

    setRouterView(routerView:FrontendyRouterView) {
        this.routerView = routerView;
    }

    findRoute(path: string): FrontendyRoute | undefined {
        console.log("path", path)
        return this.routes.find(route => route.path === path);
    }

    getUndefinedMessageComponent(): typeof FrontendyComponent | undefined {
        return this.config?.NotFoundPage;
    }

    private handleLinkClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName === "A") {
            const anchor = target as HTMLAnchorElement;
            const href = anchor.getAttribute("href");
            if (href && href.startsWith("/")) {
                event.preventDefault();
                window.history.pushState({}, "", href);
                this.setCurrentRoute();
            }
        }
    }
    private setCurrentRoute(){
        if (!this.routerView ) {
            throw new Error("Router error : routerView instance is not set");
        } 
        this.currentRoute = this.findRoute(window.location.pathname);

        this.routerView.updateCurrentRoute()
    }

    public push(name: string) {
        const route = this.routes.find(route => route.name === name);
        if (!route) {
            throw new Error(`Router error: route ${name} not found`);
        }
        if (route.path === this.currentRoute?.path) {
            throw new Error(`Router error: route ${name} already active`);
        }
        window.history.pushState({}, "", route.path);
        this.setCurrentRoute()
    }

    public getCurrentRoute(): FrontendyRoute | undefined {
        return this.currentRoute;
    }
}