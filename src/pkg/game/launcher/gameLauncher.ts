import Store from "../../../store/store";
import Game from "../../../types/Game";
import EventBroker from "../../event-broker/eventBroker";
import WebSocketClient from "../../ws-client/client";
import PlayersConfirmation from "./confirmation";
import { MMRS_Messages } from "./messages";

export default class GameLauncher {
    
    private static searchGameType: Game | null = null;
    private static isConfirmed: boolean = false;
    private static client?: WebSocketClient<MMRS_Messages>;
    private static confirmation?: PlayersConfirmation;
    private static userId?: number;

    static async startGameSearching(userId:number, game:Game, onConnectedCallback?: Function) {
        try {
            const opts = {
                onOpenCallback: () => this.onEstablishConnection(game, onConnectedCallback),
            }

            const user = await Store.getters.user()
            if (!user) {
                return ;
            }

            const addr = `ws://localhost:5001/matchmaking?id=${user?.id}&name=${user?.nickname}&mmr=${user?.rating}`;
            this.userId = userId;
            this.client = new WebSocketClient<MMRS_Messages>(addr, opts)
                .on(MMRS_Messages.MATCH_SEARCH_START, (data: any) => this.matchSearchStartHandler())
                .on(MMRS_Messages.MATCH_FOUND, (data: any) => this.matchFoundHandler(data))
                .on(MMRS_Messages.MATCH_TIMEOUT, (data: any) => this.matchTimeoutHandler(data))
                // .on(MMRS_Messages.MATCH_WAIT, (data: any) => {}); 
                // .on(MMRS_Messages.MATCH_CONFIRM, (data: any) => {})
                // .on(MMRS_Messages.MATCH_REJECT, (data: any) => {})
                
        } catch (e) {
            console.error("GameLauncher error : WebSocketClient connection error", e);
            return;
        }
    }

    private static onEstablishConnection(game: Game, onConnectedCallback?: Function) {
        console.log("GameLauncher : WebSocket connection opened");
        if (onConnectedCallback) {
            onConnectedCallback();
        }
        this.searchGameType = game;
    }

    static stopGameSearching() {
        this.searchGameType = null;
        this.userId = undefined;
        this.confirmation = undefined
        this.client?.close();
        EventBroker.getInstance().emit("deactivate-search-game-bar");
    }

    private static matchFoundHandler(data: any) {

        console.log({data})
        if (!data || !data.opponent) { 
            console.error("GameLauncher error : No opponent found");
            return;
        }

        this.confirmation = new PlayersConfirmation([this.userId, data.opponent]);
        EventBroker.getInstance().emit("deactivate-search-game-bar");
        EventBroker.getInstance().emit("activate-confirmation-modal", this.searchGameType);
    }

    private static matchSearchStartHandler() {
        EventBroker.getInstance().emit("activate-search-game-bar", this.searchGameType);
    }

    private static matchTimeoutHandler(data: any) {
        this.confirmation = undefined
        if (this.isConfirmed) {
            EventBroker.getInstance().emit("activate-search-game-bar");
        } else  {
            this.client?.close();
        }
        EventBroker.getInstance().emit("deactivate-confirmation-modal", this.searchGameType);
    }   


    // static async confirmGame(callback: Function | null = null) {
    //     if (!this.searchGameType) {
    //         return;
    //     }

    //     setTimeout(() => {
    //         this.isConfirmed = true;
    //         if (callback) {
    //             callback();
    //         }
    //     }, 200)
    // }

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

    // static getMatchPlayer() {

    //     if (!this.isConfirmed || !this.searchGameType) {
    //         return [];
    //     }

    //     const numberOfPlayers = this.searchGameType.players;
    //     const players = Array.from({ length: numberOfPlayers }, (_, index) => index + 1).map(player => {
    //         return {
    //             id: player,
    //             status: "waiting",
    //         }
    //     });
    //     players[0].status = "confirmed";
    //     return players;
    // }
}