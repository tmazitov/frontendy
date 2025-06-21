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

type FrontendyRouteParamType = "number" | "string";
export {
    FrontendyRouteParamType,
}

class FrontendyRoute {
    readonly path : string;
    readonly name : string;
    readonly component : typeof FrontendyComponent;
    private data?: {query?: Record<string, string>, params?: Record<string, string>};
    private paramsTypes?: Record<string, FrontendyRouteParamType>;

    constructor(name: string, path: string, component: typeof FrontendyComponent, paramsTypes?: Record<string, FrontendyRouteParamType>) {
        this.name = name;
        this.path = path;
        this.component = component;
        this.paramsTypes = paramsTypes;
    }

    fullRoute(): string {
        let fullPath = this.path;
        if (this.data?.params) {
            for (const [key, value] of Object.entries(this.data.params)) {
                fullPath = fullPath.replace(`:${key}`, value);
            }
        }
        const queryString = queryToString(this.data?.query);
        return `${fullPath}${queryString}`;
    }

    clone(): FrontendyRoute {
        return new FrontendyRoute(this.name, this.path, this.component, this.paramsTypes);
    }

    parseQuery(queryString: string) {
        if (!queryString) {
            return ;
        }
        const query: Record<string, string> = {};
        if (queryString) {
            const pairs = queryString.split("&");
            for (const pair of pairs) {
                const [key, value] = pair.split("=");
                if (key) {
                    query[decodeURIComponent(key)] = decodeURIComponent(value || "");
                }
            }
        }

        this.data = {
            ...this.data,
            query: query
        };
    }

    parseParams(realPath: string) {
        if (!realPath) {
            return;
        }

        const currenRouteParts = this.path.split("/");
        const realPathParts = realPath.split("/");
        if (currenRouteParts.length !== realPathParts.length) {
            return;
        }
        const params: Record<string, string> = {};
        for (let i = 0; i < currenRouteParts.length; i++) {
            const currentPart = currenRouteParts[i];
            if (currentPart.startsWith(":")) {
                const paramName = currentPart.slice(1);
                if (this.paramsTypes && this.paramsTypes[paramName]) {

                    const paramType = this.paramsTypes[paramName];
                    if (paramType === 'number' && isNaN(Number(realPathParts[i]))) {
                        throw new Error(`Param type mismatch for ${paramName}: expected ${paramType}, got ${realPathParts[i]}`);
                    } else if (paramType === 'string' && typeof realPathParts[i] !== 'string') {
                        throw new Error(`Param type mismatch for ${paramName}: expected ${paramType}, got ${realPathParts[i]}`);
                    }
                }
                params[paramName] = realPathParts[i];
            }
        }
        this.data = {
            ...this.data,
            params: params
        };
    }

    get params(): Record<string, string> | undefined {
        return this.data?.params;
    }
    get query(): Record<string, string> | undefined {
        return this.data?.query;
    }

    set params(params: Record<string, string> | undefined) {
        this.data = {
            ...this.data,
            params: params
        };
    }
    set query(query: Record<string, string> | undefined) {
        this.data = {
            ...this.data,
            query: query
        };
    }

    public getRouteRegexp(): RegExp {
        const pathParts = this.path
        .split("/")
        .map(part => {
            if (!part.startsWith(":")) {
                return part;
            }
            const paramName = part.slice(1);
            const paramType = this.paramsTypes?.[paramName];
            if (paramType === "number") {
                return "\\d+";
            }
            return "[^/]+?";
        })
        const pattern = pathParts.join("/");
        return new RegExp(`^${pattern}$`)
    }
}

export default FrontendyRoute;