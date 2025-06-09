class GameStat {
    uid: string;
    date: Date;
    typeId: number;
    statusId: number;
    winnerId: number;

    constructor(data:any) {
        this.uid = data.uid || data.id;
        this.date = new Date(data.startedAt || data.started_at);
        this.typeId = data.typeId || data.mode;
        this.statusId = data.statusId || data.status;
        this.winnerId = data.winnerId || data.winner_id;
    }

    getDateTime(): string {
        const minutes = this.date.getMinutes();
        const hours = this.date.getHours();       
 
        const time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

        return this.date.toLocaleDateString() + ' ' + time;
    }
}

export default GameStat;