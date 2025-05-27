import API from "../api/api";
import { isAuthorized } from "../api/client";
import GameStat from "../types/GameStat";
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
}

