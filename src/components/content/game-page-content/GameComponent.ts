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
import GameWaitingModal from "../../modals/GameWaitingModal";
import GameOverComponent from "./GameOverComponent";
import InfoBarComponent from "./InfoBarComponent";
import SceneComponent from "./SceneComponent";

export default class GameComponent extends FrontendyComponent {
    componentName: string = 'game-component';

    protected data(): {} {
        return {
            gameResults: false,
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

            Store.setters.updateMatchOpponentDisconnected(timeLeft);
        })
        GameWebSocket.on(SERVER_ACTION.MatchOpponentConnected, () => {
            Store.setters.updateMatchOpponentConnected()
        })

        GameWebSocket.on(SERVER_ACTION.MatchOver, (data: any) => {
            console.log("Match over cough!")
            const results = data.payload as MatchResultInfo
            Store.setters.updateMatchResult(results)
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
        } else {
            content = new SceneComponent()
        }

        return elem('div')
            .setProps({class : "flex items-center flex-col"})
            .setChild([
                new InfoBarComponent(),
                content,
                
                new GameWaitingModal(),
                // new GameOverModal(),
            ])
    }
}