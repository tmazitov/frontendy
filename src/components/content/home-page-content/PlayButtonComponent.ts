import EventBroker from "../../../pkg/event-broker/eventBroker";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameLauncher from "../../../pkg/game/launcher/gameLauncher";
import ButtonComponent from "../../inputs/ButtonComponent";
import GameLaunchModal from "../../modals/GameLauncherModal";

export default class PlayButtonComponent extends FrontendyComponent {
    componentName: string = 'play-button-component';

    data() {
        return {
            showGameLaunchModal: false,
        }
    }

    onOpenModal() {
        GameLauncher.stopGameSearching();
        this.state.showGameLaunchModal = true;
    }

    template() {
        return elem("span")
        .setChild([
            new ButtonComponent({
                label: 'Play',
                color: "blue",
                icon: "ti ti-ping-pong",
            }).onClick(() => this.onOpenModal()),
            
            new GameLaunchModal().setShow(this.state.showGameLaunchModal),
        ])
    }
}