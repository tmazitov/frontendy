import User from "../types/User";
import StoreState from "./state";
import Store from "./store";

export default class StoreGetters {
    private state: StoreState;

    constructor(state: StoreState) {
        this.state = state;
    }

    public async user(): Promise<User | undefined> {
        return this.state.user.getValue();
    }
    
    public async userNickname(): Promise<string | undefined> {
        const user = await this.state.user.getValue();
        console.log("user", user)
        if (!user) {
            return undefined;
        }
        return user.nickname;
    }

    public async userRating(): Promise<number | undefined> {
        const user = await this.state.user.getValue();
        if (!user) {
            return undefined;
        }
        return user.rating;
    }
    public async userId(): Promise<number | undefined> {
        const user = await this.state.user.getValue();
        if (!user) {
            return undefined;
        }
        return user.id;
    }
}