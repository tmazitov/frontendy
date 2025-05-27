import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameStat from "../../../types/GameStat";
import GamesTableRowComponent from "./GamesTableRowComponent";

export default class GamesTableComponent extends FrontendyComponent {
    componentName: string = 'games-table-component';

    constructor(userId:number, games: GameStat[]) {
        super({games, userId});
    }

    template() {
        return elem('div')
        .setProps({class : "max-h-[320px] overflow-y-auto"})
        .addChild(
            elem('table')
            .setProps({class: 'min-w-full table-auto'})
            .setChild([
                elem('thead')
                .setProps({class: 'sticky top-0 z-10'})
                .setChild([
                    elem('tr').setChild([
                        elem('th')
                        .setProps({class: "p-2 w-1/6 text-start"})
                        .addChild(text('ID')),

                        elem('th')
                        .setProps({class: "p-2 w-1/6 text-start border-l-1 border-gray-200"})
                        .addChild(text('Result')),

                        elem('th')
                        .setProps({class: "p-2 w-1/3 text-start border-l-1 border-gray-200"})
                        .addChild(text('Date')),

                        elem('th')
                        .setProps({class: "p-2 w-1/3 text-start border-l-1 border-gray-200"})
                        .addChild(text('Type')),

                    ]),
                ]),
                elem('tbody').setChild(this.props.games.map((game:GameStat) => {
                    return new GamesTableRowComponent(this.props.userId, game);
                }))
        ]))
    }
}