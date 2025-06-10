import { info } from "console";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import GameState from "../../../pkg/game/play/state";
import { MatchBallInfo, MatchPaddleInfo, MatchSceneInfo } from "../../../types/MatchSceneInfo";
import DelimeterComponent from "./DelimeterComponet";
import PaddleComponent from "./PaddleComponent";
import BallComponent from "./BallComponent";

let player1direction = 0;
let player2direction = 0;

type SceneComponentProps = {
    isOpponentDisconnected?: boolean;
    matchSceneConf?: MatchSceneInfo;
}

export default class SceneComponent extends FrontendyComponent {
    componentName: string = 'scene-component';

    constructor(props?: SceneComponentProps) {
        super(props);
    }

    data() {
        return {
            player1Config: {
                info: this.props.matchSceneConf?.paddle1 || undefined,
                isHidden: this.props.matchSceneConf === undefined,
                side: 'left'
            },
            player2Config: {
                info: this.props.matchSceneConf?.paddle2 || undefined,
                isHidden: this.props.matchSceneConf === undefined,
                side: 'right'
            },
            ballConfig: {
                info: this.props.matchSceneConf?.ball || undefined,
                isHidden: this.props.matchSceneConf === undefined,
            },
        }
    }

    protected onCreated(): void {
        Player.onUpdatePosition((data:Record<string,any>) => {

            if (this.props.isOpponentDisconnected) {
                console.log("sync canceled : opponent disconnected, waiting for reconnection...");
                return ;
            }

            const state = data.payload as GameState;
            if (!state) {
                return ;
            }
            
            const paddle1Info = this.state.player1Config.info as MatchPaddleInfo;
            const paddle2Info = this.state.player2Config.info as MatchPaddleInfo;
            const ballInfo = this.state.ballConfig.info as MatchBallInfo;
            if (!paddle1Info || !paddle2Info || !ballInfo) {
                console.warn("Sync warning: paddle or ball info is undefined");
                return ;
            }
            
            // Update paddles info
            paddle1Info.topLeftCornerPosY = state.paddle1.topLeftCornerPosY;
            paddle1Info.topLeftCornerPosX = state.paddle2.topLeftCornerPosX;
            paddle2Info.topLeftCornerPosY = state.paddle2.topLeftCornerPosY;
            paddle2Info.topLeftCornerPosX = state.paddle2.topLeftCornerPosX;

            // Update ball info
            ballInfo.topLeftCornerPosY = state.ball.topLeftCornerPosY;
            ballInfo.topLeftCornerPosX = state.ball.topLeftCornerPosX;
            ballInfo.speedX = state.ball.speedX;
            ballInfo.speedY = state.ball.speedY;
        })
    }

    template() {
        return elem('div')
            .setProps({ class: "p-[16px] w-[512px] h-[320px] relative bg-gray-100 rounded-lg shadow-md" })
            .setChild([
                new DelimeterComponent(),
                new PaddleComponent(this.state.player1Config),
                new PaddleComponent(this.state.player2Config),
                new BallComponent(this.state.ballConfig),
            ])
    }
}