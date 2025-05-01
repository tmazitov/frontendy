import router from "../pages/router";
import EventBroker from "../pkg/event-broker/eventBroker";
import Component from "../pkg/frontendy/component/component";
import FrontendyRouterView from "../pkg/frontendy/router/RouterView";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import Game from "../types/Game";
import NavBarLink from "../types/NavBarLink";
import SearchGameBarComponent from "./search-game-bar/SearchGameBarComponent";
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
            findGameType: null,
            showFindGameBar: false,
        }
    }

    isNavigatablePage() {
        if (!this.state.currentRoute) {
            return false;
        }
        return this.state.currentRoute.name != 'auth'
    }

    onMounted(): void {
        EventBroker.getInstance().on("activate-find-game-bar", (game: Game) => {
            if (this.state.findGameType) {
                return;
            }
            this.state.findGameType = game;
        })  
        EventBroker.getInstance().on("deactivate-find-game-bar", () => {
            if (!this.state.findGameType) {
                return;
            }
            this.state.findGameType = null;
        })
    }

    onUnmounted(): void {
        EventBroker.getInstance().off("activate-find-game-bar");    
        EventBroker.getInstance().off("deactivate-find-game-bar");
    }

    template() {
        return elem("div")
            .setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800"})
            .setChild([

                elem("span").$vif(true)
                    .addChild(new NavBarComponent(navBarLinks)),

                new FrontendyRouterView(router),

                new SearchGameBarComponent()
                    .setSearchGame(this.state.findGameType),
            ])
    }   
}