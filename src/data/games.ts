import Game from "../types/Game";

const games:Array<Game> = [
    new Game(0, "Training", "Fight against a bot to train your skills.", 1, "ti ti-robot"),
    new Game(1, "Duel", "Face off against another player in a 1v1 duel.", 2, "ti ti-users"),
    new Game(2, "Turnament", "Become the target of everyone and prove you're the king of the hill.", 8, "ti ti-tournament"),
]

export default games;