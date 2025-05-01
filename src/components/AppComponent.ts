import router from "../pages/router";
import EventBroker from "../pkg/event-broker/eventBroker";
import Component from "../pkg/frontendy/component/component";
import FrontendyRouterView from "../pkg/frontendy/router/RouterView";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import Game from "../types/Game";
import NavBarLink from "../types/NavBarLink";
import SearchGameBarComponent from "./search-game-bar/SearchGameBarComponent";
import NavBarComponent from "./nav-bar/NavBarComponent";
import GameConfirmationModal from "./modals/GameConfirmationModal";

const navBarLinks =  [
    new NavBarLink('Home', 'home', "ti ti-home"),
    new NavBarLink('About', 'about', "ti ti-info-circle"),
]

export default class AppComponent extends Component {
    
    componentName: string = 'app-container';

    data() {
        return {
            currentRoute : router.getCurrentRoute(),
            searchGameType: null,
            showGameConfirmationModal: false,
        }
    }

    isNavigatablePage() {
        if (!this.state.currentRoute) {
            return false;
        }
        return this.state.currentRoute.name != 'auth'
    }

    onMounted(): void {
        EventBroker.getInstance().on("activate-search-game-bar", (game: Game) => {
            if (this.state.searchGameType) {
                return;
            }
            this.state.searchGameType = game;
        })  
        EventBroker.getInstance().on("deactivate-search-game-bar", () => {
            if (!this.state.searchGameType) {
                return;
            }
            this.state.searchGameType = null;
        })
        EventBroker.getInstance().on("activate-confirmation-modal", () => {
            this.state.showGameConfirmationModal = true;
        })
        EventBroker.getInstance().on("deactivate-confirmation-modal", () => {
            this.state.showGameConfirmationModal = false;
        })
    }

    onUnmounted(): void {
        EventBroker.getInstance().off("activate-confirmation-modal")
        EventBroker.getInstance().off("deactivate-confirmation-modal");
        EventBroker.getInstance().off("activate-search-game-bar");    
        EventBroker.getInstance().off("deactivate-search-game-bar");
    }

    template() {
        return elem("div")
            .setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800"})
            .setChild([

                elem("span").$vif(true)
                    .addChild(new NavBarComponent(navBarLinks)),

                new FrontendyRouterView(router),

                new SearchGameBarComponent()
                    .setSearchGame(this.state.searchGameType),
                
                new GameConfirmationModal(this.state.searchGameType)
                .setShow(this.state.showGameConfirmationModal)
            ])
    }   
}