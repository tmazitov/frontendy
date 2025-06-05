import API from "../api/api";
import { isAuthorized } from "../api/client";
import GameStat from "../types/GameStat";
import PlayersInfo from "../types/PlayersInfo";
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
            // const response = await API.mmrs.userMatchStats()
            // if (!response) {
            //     throw new Error("no response");
            // }
            // if (response.status == 204) {
            //     this.state.gameStats.setValue([]);
            // } else if (response.status == 200) {

            //     if (!response.data || response.data instanceof Array === false) {
            //         throw new Error("no game stats data in response");
            //     }

            //     console.log("StoreSetters: setupGameStats response:", response.data);
            //     const gameStats = response.data.map((stat: any) => new GameStat(stat));
            //     this.state.gameStats.setValue(gameStats);
            // } else {
            //     throw new Error("unexpected response status: " + response.status);
            // }

            this.state.user.getValue((value: User | undefined) => {
                if (!value) {
                    console.error("no user!")
                    return ;
                }
                const currentDate = new Date()
                let currentRating = value.rating

                const testValues = [25, 25, 25, -25, -25, 25, -25, 25, 25, -25].map((value) => {
                    const ratingChangeDate = new Date()
                    ratingChangeDate.setDate(currentDate.getDate() - Math.floor(Math.random() * 10))
    
                    return {
                        date: ratingChangeDate,
                        rate: value
                    }
                })
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                
                for (let i = testValues.length - 1; i >= 0; i--) {
                    if (i == testValues.length - 1) {
                        testValues[i].rate = currentRating;
                    } else {
                        testValues[i].rate += currentRating;
                    }
                    currentRating = testValues[i].rate;
                }

                this.state.ratingChanges.setValue(testValues);
            });
        } catch (e) {
            console.error("Store error: can't get game stats :", e);
        }
    }

    async setupGamePlayersInfo(playersIds:number[]) {
        if (playersIds.length != 2) {
            console.error("StoreSetters: setupGamePlayersInfo: playersIds length is not 2");
            return ;
        }
        
        let player1: User | undefined = undefined;
        try {
            const response = await API.ums.userGetInfo(playersIds[0])
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
            const response = await API.ums.userGetInfo(playersIds[1])
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
        
        this.state.gamePlayersInfo.setValue(new PlayersInfo(player1, player2))
    }
}

