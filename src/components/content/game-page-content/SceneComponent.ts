import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import GameState from "../../../pkg/game/play/state";
import DelimeterComponent from "./DelimeterComponet";
import PaddleComponent from "./PaddleComponent";

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

            console.log("new state!", state, 'is change 1', this.state.player1Config.top , state.player1Pos, 'is change 2', this.state.player2Config.top , state.player2Pos);

            if (this.state.player1Config.top !== state.player1Pos) {
                this.state.player1Config = {top : state.player1Pos, side: 'left'};
            }

            if (this.state.player2Config.top !== state.player2Pos) {
                this.state.player2Config = {top : state.player2Pos, side: 'right'};
            }

            // this.state.ballConfig.top = state.ball.top;
            // this.state.ballConfig.left = state.ball.left;
        })
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