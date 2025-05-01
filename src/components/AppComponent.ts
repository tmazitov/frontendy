import router from "../pages/router";
import Component from "../pkg/frontendy/component/component";
import FrontendyRouterView from "../pkg/frontendy/router/RouterView";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import NavBarLink from "../types/NavBarLink";
import NavBarComponent from "./nav-bar/NavBarComponent";

const navBarLinks =  [
    new NavBarLink('Home', 'home', "ti ti-home"),
    new NavBarLink('About', 'about', "ti ti-info-circle"),
]

export default class AppComponent extends Component {
    
    componentName: string = 'app-container';

    data() {
        return {
            currentRoute : router.getCurrentRoute(),
            showRegModal: false,
        }
    }

    toggleShowModal() {
        this.state.showRegModal = !this.state.showRegModal; 
    }

    isNavigatablePage() {
        if (!this.state.currentRoute) {
            return false;
        }
        return this.state.currentRoute.name != 'auth'
    }

    template() {
        return elem("div")
            .setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800"})
            .setChild([

                elem("span").$vif(true)
                    .addChild(new NavBarComponent(navBarLinks)),

                new FrontendyRouterView(router),
            ])
    }   
}