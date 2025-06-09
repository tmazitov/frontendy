import GameStat from "../types/GameStat";
import PlayersInfo from "../types/PlayersInfo";
import RatingChangeInfo from "../types/RatingChangeInfo";
import User from "../types/User";
import StoreField from "./field";

export default class StoreState{
    public user:StoreField<User> = new StoreField<User>();
    public gameStats:StoreField<GameStat[]> = new StoreField<GameStat[]>();
    public ratingChanges:StoreField<RatingChangeInfo> = new StoreField<RatingChangeInfo>();
    public gamePlayersInfo:StoreField<PlayersInfo> = new StoreField<PlayersInfo>();
}