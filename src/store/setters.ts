import API from "../api/api";
import { isAuthorized } from "../api/client";
import GameStat from "../types/GameStat";
import PlayersInfo from "../types/PlayersInfo";
import RatingChangeItem from "../types/RatingChangeItem";
import User from "../types/User";
import StoreState from "./state";

export default class StoreSetters {

    private state: StoreState;

    constructor(state: StoreState) {
        this.state = state;
    }

    async updateUserNickname(nickname: string) {
        const user = await this.state.user.getValue()
        if (!user) {
            return ;
        }
        user.nickname = nickname;
        this.state.user.setValue(user)
    }

    deleteUser() {
        this.state.user.clearValue()
    }

    async setupUser() {
        if (!isAuthorized()) {
            return ;
        }
        try
        {
            const response = await API.ums.userGetInfo()
            console.log({response, data :response.data})
            if (!response) {
                throw new Error("no response");
            }
            if (!response.data) {
                throw new Error("no user data in response");
            }
            this.state.user.setValue(new User(response.data));
        } catch (e) {
            console.error("Store error: can't get user data :", e);
        }
    }

    async setupGameStats() {
        if (!isAuthorized()) {
            return ;
        }
        try {
            const response = await API.mmrs.userMatchStats()
            if (!response) {
                throw new Error("no response");
            }
            if (response.status == 204) {
                this.state.gameStats.setValue([]);
            } else if (response.status == 200) {

                if (!response.data || response.data instanceof Array === false) {
                    throw new Error("no game stats data in response");
                }

                console.log("StoreSetters: setupGameStats response:", response.data);
                const gameStats = response.data.map((stat: any) => new GameStat(stat));
                this.state.gameStats.setValue(gameStats);
            } else {
                throw new Error("unexpected response status: " + response.status);
            }
        } catch (e) {
            console.error("Store error: can't get game stats :", e);
        }
    }

    async setupRatingChanges() {
        if (!isAuthorized()) {
            return ;
        }
        try {
            this.state.user.getValue(async(user: User | undefined) => {
                if (!user) {
                    console.error("no user!")
                    return ;
                }
               
                try{
                    const response = await API.mmrs.userRatingUpdates(user.id)
                    if (!response || !response.data) {
                        throw new Error("no response or data in response");
                    }
                    const data = response.data as {playedMatches: number, updates: Array<{date: string, rate: number}>};
                    if (!data || !data.updates || !Array.isArray(data.updates)) {
                        throw new Error("no updates in response data");
                    }

                    let currentRating = user.rating;
                    const values = data.updates
                    .map((update: {date: string, rate: number}) => {
                        return {date: new Date(update.date), rate: update.rate};
                    })
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
        
                    for (let i = values.length - 1; i >= 0; i--) {
                        if (i == values.length - 1) {
                            values[i].rate = currentRating;
                        } else {
                            values[i].rate += currentRating;
                        }
                        currentRating = values[i].rate;
                    }

                    

                    this.state.ratingChanges.setValue({
                        playedMatches: data.playedMatches,
                        updates: values,
                    });
                } catch (e) {
                    console.error("StoreSetters: setupRatingChanges: error getting rating updates :", e);
                    return ;
                }
            });
        } catch (e) {
            console.error("Store error: can't get game stats :", e);
        }
    }

    async setupGamePlayersInfo(player1State: {id:number, score:number}, player2State: {id:number, score:number}) {
        if (!player1State || !player2State) {
            console.error("StoreSetters: setupGamePlayersInfo: playersIds length is not 2");
            return ;
        }
        
        let player1: User | undefined = undefined;
        try {
            const response = await API.ums.userGetInfo(player1State.id)
            const data = response.data;
            if (!data) {
                throw new Error("no user data in response");
            }
            player1 = new User(data);
        } catch (e) {
            console.error("StoreSetters: setupGamePlayersInfo: error getting player 1 info : ", e);
        }

        let player2: User | undefined = undefined;
        try {
            const response = await API.ums.userGetInfo(player2State.id)
            const data = response.data;
            if (!data) {
                throw new Error("no user data in response");
            }
            player2 = new User(data);
        } catch (e) {
            console.error("StoreSetters: setupGamePlayersInfo: error getting player 2 info : ", e);
        }

        if (!player1 || !player2) {
            console.error("StoreSetters: setupGamePlayersInfo: one of players is undefined");
            return ;
        }

        const info = new PlayersInfo(player1, player2, player1State.score, player2State.score)
        
        this.state.gamePlayersInfo.setValue(info);
    }
}

