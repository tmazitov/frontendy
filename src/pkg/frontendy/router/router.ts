import FrontendyComponent from "../component/component";
import FrontendyRoute, { FrontendyRouteParamType } from "./route";
import FrontendyRouterView from "./RouterView";

type RouterConfig = {
    notFoundPage? : typeof FrontendyComponent;
    routeIsAvailable? : (route: FrontendyRoute) => string | undefined;
}


type FrontendyRouteInfo = {
    name: string, 
    path: string,
    component: typeof FrontendyComponent,
    paramsTypes?: Record<string, FrontendyRouteParamType>
}
    

export {
    RouterConfig,
    FrontendyRouteInfo,
}

export default class FrontendyRouter {

    private routes: FrontendyRoute[] = [];
    private config: RouterConfig ;
    private _currentRoute: FrontendyRoute | undefined;
    private routerView: FrontendyRouterView | undefined;

    constructor(routesInfo: FrontendyRouteInfo[], config: RouterConfig | undefined = undefined) {
        this.config = config ?? {notFoundPage: undefined, routeIsAvailable: undefined};
        this.routes = routesInfo.map(routeInfo => {
            return new FrontendyRoute(routeInfo.name, routeInfo.path, routeInfo.component, routeInfo.paramsTypes)
        });
        this._currentRoute = this.findRoute(window.location.pathname);

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

        // Check this route is available
        const reason = this.config.routeIsAvailable?.(route)
        if (reason) {
            console.error(`Router error : route ${route.name} is not available for reason : ${reason}` )
            return undefined;
        }

        // Make clone of new route and feed it with query and params        
        try {
            const clone = route.clone();
            clone.parseQuery(path.split("?")[1] ?? "");
            clone.parseParams(pathWithoutQuery);
            return clone;
        } catch (e) {
            console.error(`Router error : failed to parse route ${route.name} with path ${pathWithoutQuery}`, e);
            return undefined;
        }
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
        this._currentRoute = this.findRoute(currentPath);
        this.routerView.updateCurrentRoute()
    }

    public push(name: string, opts?: {query?: Record<string, string>, params?: Record<string, string>}): void {
        const route = this.routes.find(route => route.name === name);
        if (!route) {
            throw new Error(`Router error: route ${name} not found`);
        }
        const clone = route.clone();
        if (opts && opts.params) {
            clone.params = opts.params
        }
        if (opts && opts.query) {
            clone.query = opts.query;
        }

        const futurePath = clone.fullRoute();
        const currentPath = window.location.pathname;
        if (futurePath === currentPath) {
            throw new Error(`Router error: route ${name} already active`);
        }
        window.history.pushState({}, "", futurePath);
        this.setCurrentRoute()
    }

    public get currentRoute(): FrontendyRoute | undefined {
        return this._currentRoute;
    }
}