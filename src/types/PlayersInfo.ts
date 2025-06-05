import User from "./User";

class PlayerInfo {
    id: number;
    avatar: string | null;
    nickname: string;
    score: number = 0;

    constructor(id: number, avatar: string | null, nickname: string) {
        this.id = id;
        this.avatar = avatar;
        this.nickname = nickname;
        this.score = 0;
    }
}

export default class PlayersInfo {
    private player1?: PlayerInfo;
    private player2?: PlayerInfo;

    constructor(player1Data: User, player2Data: User, player1Score: number = 0, player2Score: number = 0) {
        this.player1 = new PlayerInfo(player1Data.id, player1Data.avatarUrl, player1Data.nickname);
        this.player2 = new PlayerInfo(player2Data.id, player2Data.avatarUrl, player2Data.nickname);
        this.player1.score = player1Score;
        this.player2.score = player2Score;
    }

    // public isLoaded() {
    //     return this.player1 !== undefined && this.player2 !== undefined;
    // }

    // public setPlayer1(playerInfo: {id: number, avatar: string, nickname: string}) {
    //     this.player1 = new PlayerInfo(playerInfo.id, playerInfo.avatar, playerInfo.nickname);
    //     this.player1.id = playerInfo.id;
    //     this.player1.avatar = playerInfo.avatar;
    //     this.player1.nickname = playerInfo.nickname;
    // }
    // public setPlayer2(playerInfo: {id: number, avatar: string, nickname: string}) {
    //     this.player2 = new PlayerInfo(playerInfo.id, playerInfo.avatar, playerInfo.nickname);
    //     this.player2.id = playerInfo.id;
    //     this.player2.avatar = playerInfo.avatar;
    //     this.player2.nickname = playerInfo.nickname;
    // }

    public getPlayersPublicInfo() {
        return {
            player1 : {
                avatar: this.player1?.avatar,
                nickname: this.player1?.nickname,
                score: this.player1?.score || 0
            },
            player2 : {
                avatar: this.player2?.avatar,
                nickname: this.player2?.nickname,
                score: this.player2?.score || 0
            }
        }
    }
}