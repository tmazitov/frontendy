import { MatchResultInfo } from "./MatchResultInfo"

type MatchBallInfo = {
    length: number,
    width: number,
    topLeftCornerPosX: number,
    topLeftCornerPosY: number,
    speedX: number,
    speedY: number
}

type MatchPaddleInfo = {
    length: number,
    width: number,
    topLeftCornerPosX: number,
    topLeftCornerPosY: number,
    speed: number,
}

type MatchTableInfo = {
    length: number,
    width: number,
}

type MatchSceneInfo = {
    isReady: boolean,
    timeLeft: number,
    result: MatchResultInfo | undefined,
    table: MatchTableInfo,
    paddle1: MatchPaddleInfo,
    paddle2: MatchPaddleInfo,
    ball: MatchBallInfo,
}

export {
    MatchBallInfo,
    MatchPaddleInfo,
    MatchTableInfo,
    MatchSceneInfo
}