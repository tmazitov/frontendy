export default class Game {
    id: number
    name: string
    description: string
    players: number
    icon: string
    constructor(id: number, name: string, description: string, players: number, icon: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.players = players;
        this.icon = icon;
    }
}