import { time } from "console";
import API from "../../../api/api";
import { getTokens } from "../../../api/client";
import router from "../../../pages/router";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Player from "../../../pkg/game/play/player";
import SERVER_ACTION from "../../../pkg/game/play/server";
import GameWebSocket from "../../../pkg/game/play/ws";
import Store from "../../../store/store";
import { MatchInfo } from "../../../types/MatchInfo";
import { MatchResultInfo } from "../../../types/MatchResultInfo";
import GameOverComponent from "./GameOverComponent";
import InfoBarComponent from "./InfoBarComponent";
import SceneComponent from "./SceneComponent";
import GameWaitingComponent from "./GameWaitingComponent";

export default class GameComponent extends FrontendyComponent {
    componentName: string = 'game-component';

    protected data(): {} {
        return {
            gameResults: false,
            gameWaitingConf: undefined,
        }
    }

    protected onMounted(): void {
        const tokens = getTokens();
        if (!tokens) {
            router.push('home');
            return;
        }

        let isCallbackActivated = false

        const onAuthorizedCallback = (data:MatchInfo) => {
            if (!data) { 
                console.warn("Authorized warning: data is undefined");
                return ;
            }

            if (!data.player1 || !data.player2) {
                console.warn("MatchStart warning: player IDs are missing : ", data);
                return ;
            }

            const matchIsReady = data.player1.isOnline && data.player2.isOnline
            const timeLeft = matchIsReady ? 
                0 : Math.floor((data.timeoutStamp - Date.now()) / 1000);

            try{
                data.scene.timeLeft = timeLeft;
                data.scene.isReady = matchIsReady;
                data.scene.result = undefined;
                this.state.gameWaitingConf = {timeLeft, isReady: matchIsReady};
                Store.setters.setupMatchSceneInfo(data.scene);
                Store.setters.setupGamePlayersInfo(data.player1, data.player2);
            } catch (e) {
                console.error("Error setting up game players info: ", e);
            }
        }
        const onUnauthorizedCallback = () => {
            if (isCallbackActivated) {
                router.push('home');
                return ;
            }
            isCallbackActivated = true;
            API.ums.refresh()
            .then(() => Player.setup(tokens.accessToken, {
                onAuthorized: onAuthorizedCallback,
                onUnauthorized: onUnauthorizedCallback
            }))
        }
        
        Player.setup(tokens.accessToken, {
            onAuthorized: onAuthorizedCallback,
            onUnauthorized: onUnauthorizedCallback
        });
        // setTimeout(() => {
        // }, Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000)
        

        GameWebSocket.on(SERVER_ACTION.MatchOpponentDisconnected, (data:any) => {
            
            const timeLeft = Math.floor((data.payload.timeoutStamp - Date.now()) / 1000);

            // Store.setters.updateMatchOpponentDisconnected(timeLeft);
            this.state.gameWaitingConf = {timeLeft, isReady: false};
        })
        GameWebSocket.on(SERVER_ACTION.MatchOpponentConnected, () => {
            // Store.setters.updateMatchOpponentConnected()
            this.state.gameWaitingConf = {timeLeft: 0, isReady: true};
        })

        GameWebSocket.on(SERVER_ACTION.MatchOver, (data: any) => {
            console.log("Match over cough!")
            const results = data.payload as MatchResultInfo
            Store.setters.updateMatchResult(results)
        })


        GameWebSocket.on(SERVER_ACTION.MatchScoreUpdate, (data:any) => {
            console.log("Match score update!", data.payload)
            const result = data.payload as {player1Score:number, player2Score:number};
            if (!result || result.player1Score === undefined || result.player2Score === undefined) {
                console.warn("Match score update error: result is undefined or has no scores");
                return ;
            }
            Store.setters.updateMatchScore(result.player1Score, result.player2Score);
        })

        Store.getters.gameResults((value: MatchResultInfo | undefined) => {
            if (!value) {
                return ;
            }
            this.state.gameResults = value;
        } )
    }

    protected onUnmounted(): void {
        console.log("GameComponent unmounted");
        Player.cleanup();
    }


    template() {

        let content
        if (this.state.gameResults) {
            content = new GameOverComponent(this.state.gameResults)
        } else if (this.state.gameWaitingConf && !this.state.gameWaitingConf.isReady && this.state.gameWaitingConf.timeLeft){
            content = new GameWaitingComponent(this.state.gameWaitingConf.timeLeft)
        } else {
            content = new SceneComponent()
        }

        return elem('div')
            .setProps({class : "flex items-center flex-col"})
            .setChild([
                new InfoBarComponent(),
                content,
            ])
    }
}