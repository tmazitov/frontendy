import RatingChangeItem from "../pkg/rating";
import GameStat from "../types/GameStat";
import User from "../types/User";
import StoreField from "./field";

export default class StoreState{
    public user:StoreField<User> = new StoreField<User>();
    public gameStats:StoreField<GameStat[]> = new StoreField<GameStat[]>();
    public ratingChanges:StoreField<RatingChangeItem[]> = new StoreField<RatingChangeItem[]>();
}