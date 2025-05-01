import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameSearcher from "../../../pkg/game-launcher/gameSercher";
import GameLaunchModal from "../../modals/GameLauncherModal";

export default class PlayButtonComponent extends FrontendyComponent {
    componentName: string = 'play-button-component';

    data() {
        return {
            showGameLaunchModal: false,
        }
    }

    onOpenModal() {
        GameSearcher.stopGameSearching();
        this.state.showGameLaunchModal = true;
    }

    template() {
        return elem("span")
        .setChild([
            elem('button')
            .setProps({
                class : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded",
            })
            .addEventListener("click", this.onOpenModal.bind(this))
            .addChild(text("Play")),
            
            new GameLaunchModal().setShow(this.state.showGameLaunchModal),
        ])
    }
}