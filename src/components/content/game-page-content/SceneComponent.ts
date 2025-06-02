import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import GameState from "../../../pkg/game/play/state";
import DelimeterComponent from "./DelimeterComponet";
import PaddleComponent from "./PaddleComponent";

let player1direction = 0;
let player2direction = 0;

export default class SceneComponent extends FrontendyComponent {
    componentName: string = 'scene-component';

    data() {
        return {
            player1Config: {top: 0, side: 'left'},
            player2Config: {top: 0, side: 'right'},
            // ballConfig: {top: 0, left: 0},
        }
    }

    protected onCreated(): void {
        Player.onUpdatePosition((data:Record<string,any>) => {

            const state = data.payload as GameState;
            if (!state) {
                return ;
            }

            
            if (this.state.player1Config.top > state.player1Pos) {
                player1direction = -1;
            } else if (this.state.player1Config.top < state.player1Pos) {
                player1direction = 1;
            } else {
                player1direction = 0;
            }
            
            // this.state.player1Config.top = state.player1Pos;

            if (this.state.player2Config.top > state.player2Pos) {
                player2direction = -1;
            } else if (this.state.player2Config.top < state.player2Pos) {
                player2direction = 1;
            } else {
                player2direction = 0;
            }

            // this.state.player2Config.top = state.player2Pos;


            // this.state.ballConfig.top = state.ball.top;
            // this.state.ballConfig.left = state.ball.left;
        })

        setInterval(() => {
            if (player1direction !== 0) {
                this.state.player1Config.top += 1.5 * player1direction;
            }
            if (player2direction !== 0) {
                this.state.player2Config.top += 1.5 * player2direction;
            }
        }, 10)
    }

    template() {
        return elem('div')
            .setProps({ class: "p-[16px] w-[512px] h-[320px] relative bg-gray-100 rounded-lg shadow-md" })
            .setChild([
                new DelimeterComponent(),
                new PaddleComponent(this.state.player1Config),
                new PaddleComponent(this.state.player2Config),
            ])
    }
}