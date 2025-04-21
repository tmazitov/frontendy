import FrontendyComponent from "../component/component";
import { elem } from "../vdom/constructor";
import FrontendyRouter from "./router";

export default class FrontendyRouterView extends FrontendyComponent {
    static componentName: string = 'router-view';
    private router: FrontendyRouter;
    /**
     *
     */
    constructor(router: FrontendyRouter, ) {
        super();
        this.router = router;
    }

    data() {
        return {
            currentComponent: null,
        }
    }
    template() {
        const currentUrl = window.location.pathname;
        const currentRoute = this.router.findRoute(currentUrl);
        const renderComponentType = currentRoute !== undefined ?
            currentRoute.component :
            this.router.getUndefinedMessageComponent();

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