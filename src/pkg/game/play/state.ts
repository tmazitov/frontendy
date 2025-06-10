type GameState = {
	paddle1: {
		topLeftCornerPosX: number,
		topLeftCornerPosY: number,
	},
	paddle2: {
		topLeftCornerPosX: number,
		topLeftCornerPosY: number,
	},
	ball: {
		topLeftCornerPosX: number,
		topLeftCornerPosY: number,
		speedX: number,
		speedY: number,
	},
}

export default GameState 