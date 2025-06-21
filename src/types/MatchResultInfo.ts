type MatchResultStatus = "P1WIN" | "P2WIN" | "LIVE" | "FAIL";

type MatchResultInfo = {
    matchResult: MatchResultStatus; 
    places?: Array<number>;
    isTournament?: boolean;
}

export {
    MatchResultInfo,
    MatchResultStatus,
}