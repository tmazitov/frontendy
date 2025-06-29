import API from "../../../api/api";
import Config from "../../../config";
import router from "../../../pages/router";
import Store from "../../../store/store";
import Game from "../../../types/Game";
import EventBroker from "../../event-broker/eventBroker";
import WebSocketClient from "../../ws-client/client";
import PlayersConfirmation from "./confirmation";
import { MMRS_Client_Messages, MMRS_Server_Messages } from "./messages";

type GameLauncherOptions = {
    serverAddr: string;
    onConnectedCallback?: Function;
    onCloseCallback?: Function;
    onUnauthorizedCallback?: Function;
    onJoinedCallback?: Function;
    onMatchReadyCallback?: Function;
    withoutModals?: boolean;
}

export default class GameLauncher {
    
    private static searchGameType: Game | null = null;
    private static isConfirmed: boolean = false;
    private static client?: WebSocketClient<MMRS_Server_Messages>;
    private static confirmation?: PlayersConfirmation;
    private static userId?: number;
    private static opts?: GameLauncherOptions;

    static async startGameSearching(accessToken:string, game:Game, options: GameLauncherOptions) {
        if (this.client) {
            console.warn("GameWebSocket warn: client already exists. Cannot start new game searching.");
            return ;
        }

        try {
            this.opts = options;
            const opts = {
                onOpenCallback: () => this.onEstablishConnection(accessToken, game),
                onCloseCallback: () => this.onCloseConnection(options.onCloseCallback),
            }

            const user = await Store.getters.user()
            if (!user) {
                return ;
            }

            const addr = game.id == 1 ?     
                `${API.ws()}://${options.serverAddr}/api/ws/matchmaking` : 
                `${API.ws()}://${options.serverAddr}/api/ws/tournament`;
            
            this.client = new WebSocketClient<MMRS_Server_Messages>(addr, opts)
                .on(MMRS_Server_Messages.MATCH_SEARCH, (data: any) => this.matchSearchStartHandler(game, options.onConnectedCallback))
                .on(MMRS_Server_Messages.JOINED, (data: any) => this.matchSearchStartHandler(game, options.onConnectedCallback))
                .on(MMRS_Server_Messages.MATCH_FOUND, (data: any) => this.matchFoundHandler(data))
                .on(MMRS_Server_Messages.MATCH_TIMEOUT, (data: any) => this.matchTimeoutHandler(data))
                .on(MMRS_Server_Messages.UNAUTHORIZED, (data:any) => this.unatuhorizedHandler(data, options.onUnauthorizedCallback))
                .on(MMRS_Server_Messages.MATCH_READY, (data:any) => this.matchReadyHandler())
                // .on(MMRS_Messages.MATCH_WAIT, (data: any) => {}); 
                // .on(MMRS_Messages.MATCH_CONFIRM, (data: any) => {})
                // .on(MMRS_Messages.MATCH_REJECT, (data: any) => {})
                
        } catch (e) {
            console.error("GameLauncher error : WebSocketClient connection error", e);
            return;
        }
    }

    private static onEstablishConnection(accessToken:string, game: Game) {
        this.client?.send(MMRS_Client_Messages.JOIN, {token: accessToken})
    }

    private static onCloseConnection(onCloseCallback?: Function) {
        this.searchGameType = null;
        this.isConfirmed = false;
        this.confirmation = undefined;
        this.client = undefined;
        if (!this.opts?.withoutModals) {
            EventBroker.getInstance().emit("deactivate-search-game-bar");
            EventBroker.getInstance().emit("deactivate-confirmation-modal");
        }
        this.opts = undefined;
        onCloseCallback?.();
    }

    static stopGameSearching() {
        this.client?.close();
        this.client = undefined;
    }

    private static unatuhorizedHandler(data: any, onUnauthorizedCallback?:Function) {
        if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
        }
        this.stopGameSearching();
    }

    private static matchFoundHandler(data: any) {
        if (!data) { 
            console.error("GameLauncher error : No opponent found");
            return;
        }

        this.confirmation = new PlayersConfirmation(this.searchGameType?.players || 0);
        if (!this.opts?.withoutModals) {
            EventBroker.getInstance().emit("deactivate-search-game-bar");
            EventBroker.getInstance().emit("activate-confirmation-modal", {confirmTime: data.timeLeft});
        }
    }

    private static matchSearchStartHandler(game:Game, onConnectedCallback?: Function) {
        if (onConnectedCallback) {
            onConnectedCallback();
        }
        this.searchGameType = game;
        if (!this.opts?.withoutModals) {
            EventBroker.getInstance().emit("activate-search-game-bar", this.searchGameType);
        }
    }

    private static matchTimeoutHandler(data: any) {
        this.confirmation = undefined
        if (this.isConfirmed) {
            if (!this.opts?.withoutModals) {
                EventBroker.getInstance().emit("deactivate-confirmation-modal");
                EventBroker.getInstance().emit("deactivate-search-game-bar");
                EventBroker.getInstance().emit("activate-search-game-bar", this.searchGameType);
            }
            this.isConfirmed = false
        } else  {
            this.stopGameSearching()
        }
    }

    private static matchReadyHandler() {
        this.stopGameSearching();
        this.client?.close();
        this.opts?.onMatchReadyCallback?.();
        const currentRoute = router.currentRoute;
        if (currentRoute?.name !== 'game') {
            router.push('game')
        }
    }

    public static async confirmGame(callback: Function | null = null) {
        if (this.isConfirmed || !this.confirmation) {
            return; 
        }
        this.client?.send(MMRS_Client_Messages.CONFIRM)
        this.isConfirmed = true;
        this.confirmation.setConfirm()

        if (callback) {
            callback();
        }
    }


    public static getConfirmationStatus() {

        if (!this.isConfirmed || !this.searchGameType) {
            return [];
        }

        return this.confirmation?.getPlayersStatuses();
    }

    // static cancelGame(callback: Function | null = null) {
    //     if (!this.searchGameType) {
    //         return;
    //     }
    //     EventBroker.getInstance().emit("deactivate-confirmation-modal");
        
    //     setTimeout(() => { 
    //         const isWasConfirmed = this.isConfirmed;
    //         this.isConfirmed = false;
    //         if (callback) {
    //             callback();
    //         }
    //         console.log("Game cancelled", isWasConfirmed);
    //         if (!this.searchGameType) {
    //             return; 
    //         }
    //         const game = this.searchGameType;
    //         this.searchGameType = null;
    //         if (isWasConfirmed) {
    //             this.startGameSearching(this.userId || 0, game)
    //         }
    //     }, 200)
    // }

}