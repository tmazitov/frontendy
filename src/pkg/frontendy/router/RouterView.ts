import FrontendyComponent from "../component/component";
import { elem } from "../vdom/constructor";
import FrontendyRouter from "./router";

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
        this.state.currentRoute = this.calcCurrentRoute();
    }

    template() {
        const renderComponentType = this.state.currentRoute !== undefined ?
            this.state.currentRoute.component :
            this.props.router.getUndefinedMessageComponent();

        if (renderComponentType === undefined) {
            throw new Error("RouterView error : No component found for the current route.");
        }

        return elem("div")
            .setProps({ id: "router-view" })
            .setChild([
                new renderComponentType(),
            ])
    }
}