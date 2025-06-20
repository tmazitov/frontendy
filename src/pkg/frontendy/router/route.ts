import FrontendyComponent from "../component/component";

function queryToString(query?:Record<string, string>) {
    if (!query) {
        return "";
    }
    const queryString = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    return queryString ? `?${queryString}` : "";
}

class FrontendyRoute {
    path : string;
    name : string;
    component : typeof FrontendyComponent;

    constructor(name: string, path: string, component: typeof FrontendyComponent) {
        this.name = name;
        this.path = path;
        this.component = component;
    }

    fullRoute(opts?: {query?: Record<string, string>, params?: Record<string, string>}): string {
        let fullPath = this.path;
        if (opts?.params) {
            for (const [key, value] of Object.entries(opts.params)) {
                fullPath = fullPath.replace(`:${key}`, value);
            }
        }
        const queryString = queryToString(opts?.query);
        return `${fullPath}${queryString}`;
    }
}

export default FrontendyRoute;