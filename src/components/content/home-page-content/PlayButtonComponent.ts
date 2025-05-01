import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameLaunchModal from "../../modals/GameModal";

export default class PlayButtonComponent extends FrontendyComponent {
    componentName: string = 'play-button-component';

    data() {
        return {
            showGameLaunchModal: false,
        }
    }

    onOpenModal() {
        this.state.showGameLaunchModal = true;
        EventBroker.getInstance().emit("deactivate-find-game-bar");
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