import router from "../../../pages/router";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import GameWebSocket from "../../../pkg/game/play/ws";
import TimerStorage from "../../../pkg/timer";
import Store from "../../../store/store";
import ButtonComponent from "../../inputs/ButtonComponent";
import MessageComponent from "../../inputs/MessageComponent";
import GameOverIconComponent from "./GameOverIconComponent";
import GameOverTitleComponent from "./GameOverTitleComponent";

export default class GameErrorComponent extends FrontendyComponent {
    componentName: string = 'game-error-component';

    constructor(errorMessage: string) {
        super({errorMessage})
    }

    redirectHome(){
        GameWebSocket.close()
        router.push('home');
        return ;
    }

    template() {
        return elem('div')
        .setProps({class: 'p-[16px] w-[512px] relative flex flex-col items-center gap-4 align-center'})
        .setChild([
            new GameOverIconComponent("exclamation-circle"),

            new GameOverTitleComponent("Oops! An error occurred"),  

            new MessageComponent(this.props.errorMessage),

            new ButtonComponent({
                label: "Home",
                color: "blue",
            }).onClick(() => this.redirectHome()),
        ])
    }
}