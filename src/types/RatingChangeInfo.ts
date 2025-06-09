import RatingChangeItem from "./RatingChangeItem";

type RatingChangeInfo = {
    playedMatches: number,
    updates: RatingChangeItem[],
}

export default RatingChangeInfo;