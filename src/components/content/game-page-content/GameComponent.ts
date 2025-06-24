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
import { MatchResultInfo, MatchResultStatus } from "../../../types/MatchResultInfo";
import GameOverComponent from "./GameOverComponent";
import InfoBarComponent from "./InfoBarComponent";
import SceneComponent from "./SceneComponent";
import GameWaitingComponent from "./GameWaitingComponent";
import TimerStorage from "../../../pkg/timer";
import GameErrorComponent from "./GameErrorComponent";
import Config from "../../../config";
import games from "../../../data/games";
import GameLauncher from "../../../pkg/game/launcher/gameLauncher";
import EventBroker from "../../../pkg/event-broker/eventBroker";

export default class GameComponent extends FrontendyComponent {
    componentName: string = 'game-component';

    protected data(): {} {
        return {
            gameResults: undefined,
            gameWaitingConf: undefined,
            errorMessage: undefined,
            info: {isUnauthorized: false, isCallbackActivated: false},
            mmrsInfo: {isUnathorized: false, isCallbackActivated: false},
        }
    }

    protected onCreated(): void {
        GameWebSocket.on(SERVER_ACTION.Error, (data: any) => {
            const errorMessage = data.payload.message || "Unknown error";
            this.state.errorMessage = errorMessage;
        })

        GameWebSocket.on(SERVER_ACTION.MatchOpponentDisconnected, (data:any) => {
            
            const timeLeft = Math.floor((data.payload.timeoutStamp - Date.now()) / 1000);

            this.state.gameWaitingConf = {timeLeft, isReady: false};
        })
        GameWebSocket.on(SERVER_ACTION.MatchOpponentConnected, () => {
            this.state.gameWaitingConf = {timeLeft: 0, isReady: true};
        })


        GameWebSocket.on(SERVER_ACTION.MatchOver, (data: any) => {
            console.log("render results", this.state.gameResults)
            const results = data.payload as MatchResultInfo
            Store.setters.updateMatchResult(results)
            console.log("render results - match over")
        })


        GameWebSocket.on(SERVER_ACTION.MatchScoreUpdate, (data:any) => {
            const result = data.payload as {player1Score:number, player2Score:number};
            if (!result || result.player1Score === undefined || result.player2Score === undefined) {
                console.warn("Match score update error: result is undefined or has no scores");
                return ;
            }
            Store.setters.updateMatchScore(result.player1Score, result.player2Score);
        })

        const searching = localStorage.getItem('start-searching-final-match') === 'true';
        if (searching) {
            localStorage.removeItem('start-searching-final-match');
            this.subscibeOnNextMatch();
        } else {
            API.ums.refresh().then(() => {
                const tokens = getTokens();
                Player.setup(tokens.accessToken, {
                    onAuthorized: (data:MatchInfo) => this.onAuthorizedCallback(data),
                    onUnauthorized: () => this.state.info.isUnauthorized = true,
                    onCloseCallback: () => {
                        this.onCloseConnection()
                    },
                });
            })
        }

        Store.getters.gameResults((value: MatchResultInfo | undefined) => this.updateMatchResults(value))
            .then((value: MatchResultInfo | undefined) => this.updateMatchResults(value))
    }

    private async updateMatchResults(value: MatchResultInfo | undefined){
        this.state.gameResults = value;
    }

    async isWinner(status: MatchResultStatus | undefined) {
        const players = await Store.getters.gamePlayersInfo();
        const userId = await Store.getters.userId();
        const publicInfo = players?.getPlayersPublicInfo(); 
        if (!publicInfo || !userId) {
            console.warn("GameOverComponent: publicInfo or userId is undefined", {publicInfo, userId});
            return false;
        }
        return (status === 'P1WIN' && publicInfo.player1.id === userId) ||
               (status === 'P2WIN' && publicInfo.player2.id === userId);
    }

    private onUnauthorizedSearch() {

        if (this.state.mmrsInfo.isCallbackActivated) {
            console.warn("GameOverComponent : onUnauthorized is called multiple times");
            return ;
        }
        this.state.mmrsInfo.isCallbackActivated = true;

        API.ums.refresh().then((response) => {
            const newTokens = getTokens();
            if (!newTokens || !newTokens.accessToken) {
                console.warn("GameOverComponent : accessToken is undefined after refresh");
                return ;
            }
            
            GameLauncher.stopGameSearching()
            GameLauncher.startGameSearching(newTokens.accessToken, games[2], {
                serverAddr: Config.mmrsAddr,
                withoutModals: true,
                onConnectedCallback: () => {
                    this.state.mmrsInfo.isUnauthorized = false
                    this.state.mmrsInfo.isCallbackActivated = false;
                },
                onCloseCallback: () => this.onUnauthorizedSearch(),
                onMatchReadyCallback: this.onMatchReadyHandler.bind(this),
            });
        })
    }

    private subscibeOnNextMatch() {
        API.ums.refresh().then(() => {
            const tokens = getTokens()
    
            localStorage.setItem('start-searching-final-match', 'true');
    
            GameLauncher.stopGameSearching()
            GameLauncher.startGameSearching(tokens.accessToken, games[2], {
                serverAddr: Config.mmrsAddr,
                withoutModals: true,
                onCloseCallback: () => {
                    localStorage.removeItem('start-searching-final-match');
                },
                onUnauthorizedCallback: () => this.state.mmrsInfo.isUnauthorized = true,
                onMatchReadyCallback: this.onMatchReadyHandler.bind(this),
            });
        })
    }


    private onMatchReadyHandler() {
        console.log("final match ready!")
        API.ums.refresh().then(() => {
            const tokens = getTokens();

            localStorage.setItem('final-match-found', 'true');
    
            GameLauncher.stopGameSearching()
            Player.setup(tokens.accessToken, {
                onAuthorized: (data:MatchInfo) => this.onAuthorizedCallback(data),
                onUnauthorized: () => this.state.info.isUnauthorized = true,
                // onCloseCallback: () => {
                //     this.onCloseConnection.bind(this)
                // },
            });
        })
    }

    private onAuthorizedCallback (data:MatchInfo) {
        if (!data) { 
            console.warn("Authorized warning: data is undefined");
            return ;
        }

        if (!data.player1 || !data.player2) {
            console.warn("MatchStart warning: player IDs are missing : ", data);
            return ;
        }
        this.state.info.isUnauthorized = false;

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

    private onUnauthorizedCallback() {
        console.log("connection closed --> callback activated", this.state.info.isCallbackActivated);

        if (this.state.info.isCallbackActivated) {
            this.state.errorMessage = "Unauthorized access. Please log in again.";
            return ;
        }

        this.state.info.isCallbackActivated = true;
        
        API.ums.refresh().then(() => {
            const newTokens = getTokens();
            if (!newTokens || !newTokens.accessToken) {
                this.state.errorMessage = "Failed to update access. Please log in again.";
                return ;
            }

            this.state.errorMessage = undefined;
            
            Player.setup(newTokens.accessToken, {
                onAuthorized: (data:MatchInfo) => this.onAuthorizedCallback(data),
                onUnauthorized: () => this.state.info.isUnauthorized = true,
                // onCloseCallback: this.onCloseConnection.bind(this),
            })
        })
    }

    private async onCloseConnection() {

        TimerStorage.removeTimer('game-ball');
        TimerStorage.removeTimer('game-paddle-left');
        TimerStorage.removeTimer('game-paddle-right');
        
        Player.cleanup();

        console.log("FINAL :", this.state.gameResults, this.state.gameResults?.isTournament, localStorage.getItem('final-match-found'), localStorage.getItem('final-match-found') === 'true' )
        if (this.state.gameResults) {
            const isWinner = await this.isWinner(this.state.gameResults.matchResult);
            if (isWinner && this.state.gameResults.isTournament && !localStorage.getItem('final-match-found')) {
                this.subscibeOnNextMatch();
            } else if (this.state.gameResults.isTournament && localStorage.getItem('final-match-found') == 'true') {
                localStorage.removeItem('final-match-found');
            }
            return ;
        }
        
        // if (this.state.info.isUnauthorized) {
        //     console.log("connection closed --> unauthorized");
        //     this.onUnauthorizedCallback();
        //     return ;
        // }

        this.state.errorMessage = "Server disconnected."
    }
    template() {

        let content
        
        console.log("render results", this.state.gameResults)

        if (this.state.errorMessage) {
            content = new GameErrorComponent(this.state.errorMessage)
        } else if (this.state.gameResults) {
            content = new GameOverComponent(this.state.gameResults)
        } else if (this.state.gameWaitingConf && !this.state.gameWaitingConf.isReady && this.state.gameWaitingConf.timeLeft){
            content = new GameWaitingComponent(this.state.gameWaitingConf.timeLeft)
        } else {
            content = new SceneComponent()
        }
        

        return elem('div')
            .setProps({class : "flex items-center flex-col"})
            .setChild([
                new InfoBarComponent(this.state.errorMessage !== undefined),
                content,
            ])
    }
}