export default class PlayersConfirmation {
    
    private playersStatuses: Array<boolean>;

    constructor(playersCount: number) {
        this.playersStatuses = new Array(playersCount).fill(false)
    }

    public setConfirm() {
        const unconfirmedIndex = this.playersStatuses.findIndex((status) => !status);
        if (unconfirmedIndex !== -1) {
            this.playersStatuses[unconfirmedIndex] = true;
        }
    }

    public getPlayersStatuses() {
        return this.playersStatuses.map((status:boolean) => {
            return status ? "confirmed" : "waiting";
        });
    }
}