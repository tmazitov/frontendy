import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameStat from "../../../types/GameStat";
import GamesTableComponent from "./GamesTableComponent";


const games = [
    new GameStat({uid: "1234", date: '2023-03-01', typeId: 0, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-02', typeId: 1, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-03', typeId: 2, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-04', typeId: 2, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-01', typeId: 0, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-02', typeId: 1, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-03', typeId: 2, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-04', typeId: 2, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-01', typeId: 0, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-02', typeId: 1, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-03', typeId: 2, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-04', typeId: 2, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-01', typeId: 0, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-02', typeId: 1, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-03', typeId: 2, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-04', typeId: 2, winnerId: 1}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
    new GameStat({uid: "1234", date: '2023-03-05', typeId: 1, winnerId: 0}),
]

export default class GamesContentComponent extends FrontendyComponent {
    componentName: string = 'games-content';

    data() {
        return {}
    }

    template() {
        return elem('div')
            .setChild([
                new GamesTableComponent(games)
            ])
    }
}