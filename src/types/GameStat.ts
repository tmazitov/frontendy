class GameStat {
    uid: string;
    date: Date;
    typeId: number;
    statusId: number;
    winnerId: number;

    constructor(data:any) {
        this.uid = data.uid;
        this.date = new Date(data.date);
        this.typeId = data.typeId;
        this.statusId = data.statusId;
        this.winnerId = data.winnerId;
    }

    getDateTime(): string {
        const minutes = this.date.getMinutes();
        const hours = this.date.getHours();       
 
        const time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

        return this.date.toLocaleDateString() + ' ' + time;
    }
}

export default GameStat;