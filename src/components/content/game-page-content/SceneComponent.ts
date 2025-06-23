import { info } from "console";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import GameState from "../../../pkg/game/play/state";
import { MatchBallInfo, MatchPaddleInfo, MatchSceneInfo } from "../../../types/MatchSceneInfo";
import DelimeterComponent from "./DelimeterComponet";
import PaddleComponent from "./PaddleComponent";
import BallComponent from "./BallComponent";
import Store from "../../../store/store";

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
            fieldSize: {
                length: 512,
                width: 320,
            },
            player1Config: {
                info: undefined,
                isHidden: true,
                side: 'left'
            },
            player2Config: {
                info: undefined,
                isHidden: true,
                side: 'right'
            },
            ballConfig: {
                info: undefined,
                isHidden: true,
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
            paddle1Info.topLeftCornerPosX = state.paddle1.topLeftCornerPosX;
            paddle2Info.topLeftCornerPosY = state.paddle2.topLeftCornerPosY;
            paddle2Info.topLeftCornerPosX = state.paddle2.topLeftCornerPosX;

            // Update ball info
            ballInfo.topLeftCornerPosY = state.ball.topLeftCornerPosY;
            ballInfo.topLeftCornerPosX = state.ball.topLeftCornerPosX;
            ballInfo.speedX = state.ball.speedX;
            ballInfo.speedY = state.ball.speedY;
        })

        Store.getters.gameSceneInfo((info: MatchSceneInfo | undefined) => this.setupGameSceneInfo(info))
            .then((info: MatchSceneInfo | undefined) => this.setupGameSceneInfo(info))
    }

    private setupGameSceneInfo(sceneInfo: MatchSceneInfo | undefined){
        if (!sceneInfo) {
            return ;
        }

        this.state.fieldSize = {
            length: sceneInfo.table.length, 
            width: sceneInfo.table.width,
        }

        const paddle1Info = sceneInfo.paddle1;
        const paddle2Info = sceneInfo.paddle2;
        const ballInfo = sceneInfo.ball;

        this.state.player1Config.info = paddle1Info;
        this.state.player1Config.isHidden = false;
        this.state.player2Config.info = paddle2Info;
        this.state.player2Config.isHidden = false;
        this.state.ballConfig.info = ballInfo;
        this.state.ballConfig.isHidden = false;
        // this.update();
    }

    template() {

        const filedSize = this.state.fieldSize;

        return elem('div')
            .setProps({ class: `p-[16px] w-[${filedSize.length}px] h-[${filedSize.width}px] relative bg-gray-50 rounded-lg border-1 border-gray-200` })
            .setChild([
            new DelimeterComponent(),
            new PaddleComponent(this.state.player1Config),
            new PaddleComponent(this.state.player2Config),
            new BallComponent(this.state.ballConfig),
            ])
    }
}