import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import GameProc from "../../../pkg/game/proc/ws";
import InfoBarComponent from "./InfoBarComponent";
import SceneComponent from "./SceneComponent";

export default class GameComponent extends FrontendyComponent {
    componentName: string = 'game-component';

    data() {
        return {}
    }

    protected onCreated(): void {
        GameProc.connect()

        let direction:number = 0
        const pressedKeys = new Set<string>();

        window.addEventListener("keydown", (event) => {
            console.log("Key pressed:", event.key, "Direction:", direction);
            if ((direction != 1) && (event.key === "w")) {
                GameProc.playerMoveUp();
                direction = 1;
                pressedKeys.add(event.key);
            }
            if ((direction != -1) && (event.key === "s")) {
                GameProc.playerMoveDown();
                direction = -1;
                pressedKeys.add(event.key);
            }
        })

        window.addEventListener("keyup", (event) => {
            if (pressedKeys.has(event.key)) {
                pressedKeys.delete(event.key);
            }

            if (pressedKeys.size === 0) {
                direction = 0;
                GameProc.playerStop();
            } else { 
                if (direction != 1 && pressedKeys.has("w")) {
                    GameProc.playerMoveUp();
                    direction = 1;
                } else if (direction != -1 && pressedKeys.has("s")) {
                    GameProc.playerMoveDown();
                    direction = -1;
                }
            }
        })
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