import User from "../types/User";
import StoreState from "./state";

export default class StoreGetters {
    private state: StoreState;

    constructor(state: StoreState) {
        this.state = state;
    }

    public async user(onUpdate?:(value:User|undefined) => void): Promise<User | undefined> {
        return this.state.user.getValue(onUpdate);
    }
    
    public async userNickname(onUpdate?:(value:string|undefined) => void): Promise<string | undefined> {

        const onUpdateCallback = onUpdate ? 
            (value: User | undefined) => onUpdate(value?.nickname) : undefined;

        const user = await this.state.user.getValue(onUpdateCallback)
        if (!user) {    
            return undefined;
        }
        return user.nickname;
    }

    public async userRating(onUpdate?:(value:number|undefined) => void): Promise<number | undefined> {

        const onUpdateCallback = onUpdate ? 
            (value: User | undefined) => onUpdate(value?.rating) : undefined;

        const user = await this.state.user.getValue(onUpdateCallback);
        if (!user) {
            return undefined;
        }
        return user.rating;
    }
    public async userId(onUpdate?:(value:number|undefined) => void): Promise<number | undefined> {

        const onUpdateCallback = onUpdate ? 
            (value: User | undefined) => onUpdate(value?.id) : undefined;

        const user = await this.state.user.getValue(onUpdateCallback);
        if (!user) {
            return undefined;
        }
        return user.id;
    }
}