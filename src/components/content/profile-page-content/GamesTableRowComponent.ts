import games from "../../../data/games";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import GameStat from "../../../types/GameStat";
import TagComponent from "../../inputs/TagComponent";

export default class GamesTableRowComponent extends FrontendyComponent {
    componentName: string = 'games-table-row-component';

    constructor(gameStat: GameStat) {
        super({gameStat});
    }

    getGameTypeName() {
        return games.find((game) => game.id === this.props.gameStat.typeId)?.name || 'Unknown';
    }

    getGameResult() {
        return this.props.gameStat.winnerId === 0 ? 'Win' : 'Lose';
    }

    template() {

        const gameResultStyle = this.props.gameStat.winnerId === 0 ? 'green' : 'red';

        return elem('tr')
        .setProps({class: 'border-t-1 border-gray-200'})
        .setChild([
            elem('td')
            .setProps({class: 'p-2 text-sm'})
            .addChild(text("#" + this.props.gameStat.uid)),

            elem('td')
            .setProps({class: `p-2 border-l-1 border-gray-200 text-sm`})
            .addChild(new TagComponent({label: this.getGameResult(), color: gameResultStyle})),

            elem('td')
            .setProps({class: 'p-2 border-l-1 border-gray-200 text-sm'})
            .addChild(text(this.props.gameStat.getDateTime())),
            
            elem('td')
            .setProps({class: 'p-2 border-l-1 border-gray-200 text-sm'})
            .addChild(text(this.getGameTypeName())),
            

        ])
    }
}