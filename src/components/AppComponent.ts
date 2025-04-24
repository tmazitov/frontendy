import NotFoundPage from "../pages/NotFoundPage";
import router from "../pages/router";
import Component from "../pkg/frontendy/component/component";
import FrontendyRouterView from "../pkg/frontendy/router/RouterView";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import NavBarLink from "../types/NavBarLink";
import NavBarComponent from "./NavBar/NavBarComponent";

const navBarLinks =  [
    new NavBarLink('Home', 'home'),
    new NavBarLink('About', 'about'),
]

export default class AppComponent extends Component {
    
    componentName: string = 'app-container';

    protected data() {
        return {
            currentRoute : router.getCurrentRoute(),
        }
    }

    isNavigatablePage() {
        if (!this.state.currentRoute) {
            return false;
        }
        return this.state.currentRoute.name != 'auth'
    }

    template() {
        return elem("div")
            .setProps({ id: "app" })
            .setChild([
                elem("span").$vif(this.isNavigatablePage())
                    .addChild(new NavBarComponent(navBarLinks)),
                new FrontendyRouterView(router)
            ])
    }   
}