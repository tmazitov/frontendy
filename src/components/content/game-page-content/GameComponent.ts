import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import GameProc from "../../../pkg/game/play/ws";
import InfoBarComponent from "./InfoBarComponent";
import SceneComponent from "./SceneComponent";

export default class GameComponent extends FrontendyComponent {
    componentName: string = 'game-component';

    data() {
        return {}
    }

    template() {
        return elem('div')
            .setProps({class : "flex items-center flex-col"})
            .setChild([
                new InfoBarComponent({
                    player1Nickname: "Player 1",
                    player2Nickname: "Player 2",
                    player1Score: 0,
                    player2Score: 0,
                }),
                new SceneComponent(),
            ])
    }
}