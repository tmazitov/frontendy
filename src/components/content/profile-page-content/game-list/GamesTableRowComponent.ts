import games from "../../../../data/games";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem, text } from "../../../../pkg/frontendy/vdom/constructor";
import GameStat from "../../../../types/GameStat";
import TagComponent from "../../../inputs/TagComponent";

export default class GamesTableRowComponent extends FrontendyComponent {
    componentName: string = 'games-table-row-component';

    constructor(userId:number, gameStat: GameStat) {
        super({userId, gameStat});
    }

    getGameTypeName() {
        return games.find((game) => game.id === this.props.gameStat.typeId)?.name || 'Unknown';
    }

    getGameResult() {
        if (this.props.gameStat.winnerId == null) {
            return 'Playing'
        }

        return this.props.gameStat.winnerId === this.props.userId ? 'Win' : 'Lose';
    }

    getGameResultStyle() {

        if (this.props.gameStat.winnerId == null) {
            return 'blue'
        }

        return this.props.gameStat.winnerId === this.props.userId ? 'green' : 'red'
    }

    template() {
        return elem('tr')
        .setProps({class: 'border-t-1 border-gray-200'})
        .setChild([
            elem('td')
            .setProps({class: 'p-2 text-sm'})
            .addChild(text("#" + this.props.gameStat.uid)),

            elem('td')
            .setProps({class: `p-2 border-l-1 border-gray-200 text-sm`})
            .addChild(new TagComponent({label: this.getGameResult(), color: this.getGameResultStyle()})),

            elem('td')
            .setProps({class: 'p-2 border-l-1 border-gray-200 text-sm'})
            .addChild(text(this.props.gameStat.getDateTime())),
            
            elem('td')
            .setProps({class: 'p-2 border-l-1 border-gray-200 text-sm'})
            .addChild(text(this.getGameTypeName())),
            

        ])
    }
}