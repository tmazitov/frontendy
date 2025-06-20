import FrontendyComponent from "../component/component";
import FrontendyRoute from "./route";
import FrontendyRouterView from "./RouterView";

type RouterConfig = {
    notFoundPage? : typeof FrontendyComponent;
    routeIsAvailable? : (route: FrontendyRoute) => string | undefined;
}

export {
    RouterConfig,
}

type FrontendyRouteInfo = {
    name: string, 
    path: string,
    component: typeof FrontendyComponent
}
    
export default class FrontendyRouter {

    private routes: FrontendyRoute[] = [];
    private config: RouterConfig ;
    private currentRoute: FrontendyRoute | undefined;
    private routerView: FrontendyRouterView | undefined;

    constructor(routesInfo: FrontendyRouteInfo[], config: RouterConfig | undefined = undefined) {
        this.config = config ?? {notFoundPage: undefined, routeIsAvailable: undefined};
        this.routes = routesInfo.map(routeInfo => new FrontendyRoute(routeInfo.name, routeInfo.path, routeInfo.component));
        this.currentRoute = this.findRoute(window.location.pathname);

        document.addEventListener("click", this.handleLinkClick.bind(this));
        window.addEventListener("popstate", () => this.setCurrentRoute());
    }

    setRouterView(routerView:FrontendyRouterView) {
        this.routerView = routerView;
    }

    findRoute(path: string): FrontendyRoute | undefined {

        const pathWithoutQuery = path.split("?")[0];

        const route = this.routes.find(route => {
            if (route.path === pathWithoutQuery) {
                return true;
            }
            // Check if the path matches the route with parameters
            const paramPattern = route.path.replace(/:[^\s/]+/g, "([^/]+)");
            const regex = new RegExp(`^${paramPattern}$`);
            return regex.test(pathWithoutQuery);
        })
        if (!route) {
            return undefined
        }

        if (!this.config.routeIsAvailable) {
            return route
        }
        const reason = this.config.routeIsAvailable(route)
        if (reason) {
            console.error(`Router error : route ${route.name} is not available for reason : ${reason}` )
            return undefined;
        }
        return route;
    }

    getUndefinedMessageComponent(): typeof FrontendyComponent | undefined {
        return this.config?.notFoundPage;
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
        const currentPath = window.location.pathname;
        this.currentRoute = this.findRoute(currentPath);
        this.routerView.updateCurrentRoute()
    }

    public push(name: string, opts?: {query?: Record<string, string>, params?: Record<string, string>}): void {
        const route = this.routes.find(route => route.name === name);
        if (!route) {
            throw new Error(`Router error: route ${name} not found`);
        }
        const futurePath = route.fullRoute(opts);
        const currentPath = window.location.pathname;
        if (futurePath === currentPath) {
            throw new Error(`Router error: route ${name} already active`);
        }
        window.history.pushState({}, "", futurePath);
        this.setCurrentRoute()
    }

    public getCurrentRoute(): FrontendyRoute | undefined {
        return this.currentRoute;
    }
}