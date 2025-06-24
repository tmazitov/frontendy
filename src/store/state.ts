import FriendInvite from "../types/FriendInvite";
import GameStat from "../types/GameStat";
import { MatchSceneInfo } from "../types/MatchSceneInfo";
import PlayersInfo from "../types/PlayersInfo";
import RatingChangeInfo from "../types/RatingChangeInfo";
import User from "../types/User";
import StoreField from "./field";

export default class StoreState{
    public isReconnect:StoreField<boolean> = new StoreField<boolean>();
    public user:StoreField<User> = new StoreField<User>();
    public freinds:StoreField<User[]> = new StoreField<User[]>();
    public friendsInvites:StoreField<FriendInvite[]> = new StoreField<FriendInvite[]>();
    public ratingChanges:StoreField<RatingChangeInfo> = new StoreField<RatingChangeInfo>();

    public gameStats:StoreField<GameStat[]> = new StoreField<GameStat[]>();
    public gamePlayersInfo:StoreField<PlayersInfo> = new StoreField<PlayersInfo>();
    public gameSceneInfo:StoreField<MatchSceneInfo> = new StoreField<MatchSceneInfo>();
}