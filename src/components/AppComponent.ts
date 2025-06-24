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
import TimerStorage from "../pkg/timer";
import { isAuthorized } from "../api/client";
import Store from "../store/store";
import UMSOnline from "../pkg/onlineConnection";
import API from "../api/api";

const navBarLinks =  [
    new NavBarLink('Home', 'home', "ti ti-home"),
    new NavBarLink('About', 'about', "ti ti-info-circle"),
]

export default class AppComponent extends Component {
    
    componentName: string = 'app-container';

    data() {
        return {
            isAuthorized: isAuthorized(),
            currentRoute : router.currentRoute,
            searchGameType: null,
            showGameConfirmationModal: false,
            confirmTime: undefined,
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
                console.warn("unable to activate search game bar, because it is already active");
                return;
            }
            this.state.searchGameType = game;
        })  
        EventBroker.getInstance().on("deactivate-search-game-bar", () => {
            if (!this.state.searchGameType) {
                console.warn("unable to deactivate search game bar, because it is not active");
                return;
            }
            TimerStorage.removeTimer("game-search-bar");
            this.state.searchGameType = null;
        })
        EventBroker.getInstance().on("activate-confirmation-modal", (data:{confirmTime: number}) => {
            this.state.showGameConfirmationModal = true;
            this.state.confirmTime = data.confirmTime;
        })
        EventBroker.getInstance().on("deactivate-confirmation-modal", () => {
            TimerStorage.removeTimer("game-confirmation-modal");
            this.state.showGameConfirmationModal = false;
        })

        EventBroker.getInstance().on("update-auth", () => {
            this.state.isAuthorized = isAuthorized();
            if (this.state.isAuthorized) {
                API.ums.refresh().then(() => UMSOnline.connect())
                
            } else {
                UMSOnline.disconnect();
            }
        })
    }

    protected onCreated(): void {
        Store.setters.setupUser()
        
        if (isAuthorized()) {
            API.ums.refresh().then(() => UMSOnline.connect())
        }
    }

    onUnmounted(): void {
        EventBroker.getInstance().off("activate-confirmation-modal")
        EventBroker.getInstance().off("deactivate-confirmation-modal");
        EventBroker.getInstance().off("activate-search-game-bar");    
        EventBroker.getInstance().off("deactivate-search-game-bar");
        EventBroker.getInstance().off("update-auth");
    }

    template() {
        return elem("div")
            .setProps({ id: "app", class: "h-screen w-screen bg-gray-100 text-gray-800"})
            .setChild([

                elem("span").$vif(true)
                    .addChild(new NavBarComponent(navBarLinks, this.state.isAuthorized)),

                new FrontendyRouterView(router),

                new SearchGameBarComponent()
                    .setSearchGame(this.state.searchGameType),
                
                new GameConfirmationModal(this.state.searchGameType, this.state.confirmTime)
                .setShow(this.state.showGameConfirmationModal)
            ])
    }   
}