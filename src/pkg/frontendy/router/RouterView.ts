import FrontendyComponent from "../component/component";
import { elem } from "../vdom/constructor";
import FrontendyRouter from "./router";

let lastRenderedRouteComponent:FrontendyComponent | undefined = undefined;
export default class FrontendyRouterView extends FrontendyComponent {
    componentName: string = 'router-view';


    constructor(router: FrontendyRouter) {
        super({router});
        router.setRouterView(this);
    }

    data() {
        return {
            currentRoute: this.calcCurrentRoute(),
        }
    }

    calcCurrentRoute(){
        const currentUrl = window.location.pathname;
        return this.props.router.findRoute(currentUrl)
    }

    updateCurrentRoute() {
        const newRoute = this.calcCurrentRoute();
        if (this.state.currentRoute !== newRoute) {
            this.state.currentRoute = newRoute;
        } 
    }

    template() {
        const renderComponentType = this.state.currentRoute !== undefined ?
            this.state.currentRoute.component :
            this.props.router.getUndefinedMessageComponent();

        if (renderComponentType === undefined) {
            throw new Error("RouterView error : No component found for the current route.");
        }

        // if (lastRenderedRouteComponent) {
        //     lastRenderedRouteComponent.unmount();
        // }
        lastRenderedRouteComponent = new renderComponentType();

        return elem("div")
            .setProps({ id: "router-view" })
            .setChild([
                lastRenderedRouteComponent,
            ])
    }
}