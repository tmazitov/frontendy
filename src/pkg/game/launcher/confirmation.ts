export default class PlayersConfirmation {
    
    private playersStatuses: Array<{player: number, confirm: boolean}>;

    constructor( players: Array<number>) {
        this.playersStatuses = players.map(player => {
            return {
                player: player,
                confirm: false,
            }
        })
    }

    public setConfirm(player: number) {
        const playerStatus = this.playersStatuses.find(p => p.player === player);
        if (playerStatus) {
            playerStatus.confirm = true;
        }
    }


    public getPlayersStatuses() {
        return this.playersStatuses;
    }
}