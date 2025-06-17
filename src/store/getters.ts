import FriendInvite from "../types/FriendInvite";
import GameStat from "../types/GameStat";
import { MatchResultInfo } from "../types/MatchResultInfo";
import { MatchSceneInfo } from "../types/MatchSceneInfo";
import PlayersInfo from "../types/PlayersInfo";
import RatingChangeInfo from "../types/RatingChangeInfo";
import User from "../types/User";
import StoreState from "./state";

export default class StoreGetters {
    private state: StoreState;

    constructor(state: StoreState) {
        this.state = state;
    }

    public async gameStats(onUpdate?:(value:GameStat[]|undefined) => void): Promise<GameStat[] | undefined> {
        return this.state.gameStats.getValue(onUpdate);
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

    public async userFriends(onUpdate?:(value:User[]|undefined) => void): Promise<User[] | undefined> {
        return this.state.freinds.getValue(onUpdate);
    }

    public async userFriendsInvites(onUpdate?:(value:FriendInvite[]|undefined) => void): Promise<FriendInvite[] | undefined> {
        return this.state.friendsInvites.getValue(onUpdate);
    }

    public async userRatingChanges(onUpdate?:(value:RatingChangeInfo|undefined) => void): Promise<RatingChangeInfo | undefined> {
        return this.state.ratingChanges.getValue(onUpdate);
    }

    public async gamePlayersInfo(onUpdate?:(value:PlayersInfo|undefined) => void): Promise<PlayersInfo | undefined> {
        return this.state.gamePlayersInfo.getValue(onUpdate);
    }

    public async gameIsReady(onUpdateCallback?:(value:boolean|undefined) => void): Promise<boolean | undefined> {
        const callback = (value: MatchSceneInfo | undefined) => onUpdateCallback?.(value?.isReady)
        const gameSceneInfo = await this.state.gameSceneInfo.getValue(callback);
        if (!gameSceneInfo) {
            return undefined;
        }

        return gameSceneInfo.isReady;
    }
 
    public async gameResults(onUpdateCallback?:(value:MatchResultInfo|undefined) => void): Promise<MatchResultInfo | undefined> {
        const callback = (value: MatchSceneInfo | undefined) => onUpdateCallback?.(value?.result);
        const gameSceneInfo = await this.state.gameSceneInfo.getValue(callback);
        if (!gameSceneInfo) {
            return undefined;
        }

        return gameSceneInfo.result;
    }

    public async gameSceneInfo(onUpdateCallback?:(value:MatchSceneInfo|undefined) => void): Promise<MatchSceneInfo | undefined> {
        const callback = (value: MatchSceneInfo | undefined) => onUpdateCallback?.(value);
        return this.state.gameSceneInfo.getValue(callback);
    }
}