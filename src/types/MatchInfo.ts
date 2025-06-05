export type MatchInfo = {
    player1: {id: number, score: number},
    player2: {id: number, score: number},
    timeLeft: number,
    isMatchReady?: boolean, // All players are connected to the game and can play
}