import { MatchSceneInfo } from "./MatchSceneInfo"

export type MatchInfo = {
    player1: {id: number, score: number, isOnline: boolean},
    player2: {id: number, score: number, isOnline: boolean},
    timeoutTimestamp: number,
    scene: MatchSceneInfo,
}