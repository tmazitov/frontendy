import FrontendyComponent from "../component/component";
import FrontendyRoute from "./route";

class RouterConfig {
    NotFoundPage : typeof FrontendyComponent | undefined = undefined;
}

export {
    RouterConfig,
}

export default class FrontendyRouter {

    private routes: FrontendyRoute[] = [];
    private config: RouterConfig ;

    constructor(routes: FrontendyRoute[], config: RouterConfig | undefined = undefined) {
        this.config = config ?? new RouterConfig();
        this.routes = routes;
    }

    findRoute(path: string): FrontendyRoute | undefined {
        return this.routes.find(route => route.path === path);
    }

    getUndefinedMessageComponent(): typeof FrontendyComponent | undefined {
        return this.config?.NotFoundPage;
    }
}