import Game from "../../types/Game";
import EventBroker from "../event-broker/eventBroker";

export default class GameSearcher {
    
    private static searchGameType: Game | null = null;
    private static isConfirmed: boolean = false;

    static startGameSearching(game:Game, callback: Function | null = null) {
        setTimeout(() => {
            EventBroker.getInstance().emit("activate-search-game-bar", game);
            this.searchGameType = game;
            if (callback) {
                callback();
            }
            setTimeout(() => {
                this.foundGame()
            }, 5000)
        }, 2000)
    }

    static foundGame() {
        EventBroker.getInstance().emit("deactivate-search-game-bar");
        EventBroker.getInstance().emit("activate-confirmation-modal", this.searchGameType);
    }

    static stopGameSearching() {
        this.searchGameType = null;
        EventBroker.getInstance().emit("deactivate-search-game-bar");
    }

    static confirmGame(callback: Function | null = null) {
        if (!this.searchGameType) {
            return;
        }

        setTimeout(() => {
            this.isConfirmed = true;
            if (callback) {
                callback();
            }
        }, 200)
    }

    static cancelGame(callback: Function | null = null) {
        if (!this.searchGameType) {
            return;
        }
        EventBroker.getInstance().emit("deactivate-confirmation-modal");
        
        setTimeout(() => { 
            const isWasConfirmed = this.isConfirmed;
            this.isConfirmed = false;
            if (callback) {
                callback();
            }
            console.log("Game cancelled", isWasConfirmed);
            if (!this.searchGameType) {
                return; 
            }
            const game = this.searchGameType;
            this.searchGameType = null;
            if (isWasConfirmed) {
                this.startGameSearching(game)
            }
        }, 200)
    }

    static getMatchPlayer() {

        if (!this.isConfirmed || !this.searchGameType) {
            return [];
        }

        const numberOfPlayers = this.searchGameType.players;
        const players = Array.from({ length: numberOfPlayers }, (_, index) => index + 1).map(player => {
            return {
                id: player,
                status: "waiting",
            }
        });
        players[0].status = "confirmed";
        return players;
    }
}