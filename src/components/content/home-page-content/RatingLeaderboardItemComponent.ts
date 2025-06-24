import { text } from "stream/consumers";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";

export default class RatingLeaderboardItemComponent extends FrontendyComponent {
    componentName: string = 'games-table-row-component';

    constructor(index:number, nickname: string, rating: number) {
        super({index, nickname, rating: rating});
    }

    private getIconClass() {
        if (this.props.index === 0) {
            return 'ti ti-crown text-yellow-500';
        } else if (this.props.index === 1) {
            return 'ti ti-medal text-gray-500';
        } else if (this.props.index === 2) {
            return 'ti ti-cup text-yellow-600';
        } else {
            return 'ti ti-star text-gray-400';
        }
    }

    template() {

        return elem('tr')
        .setProps({class: 'border-t-1 border-gray-200'})
        .setChild([
            elem('td')
            .setProps({class: 'p-2 text-sm'})
            .setChild([
                elem("i").setProps({class: `ti ti-number-${this.props.index + 1} ml-1`}),
                elem("i").setProps({class: `ti ${this.getIconClass()}`}),
            ]),

            elem('td')
            .setProps({class: 'p-2 border-l-1 border-gray-200 text-sm'})
            .addChild(this.props.nickname),
            
            elem('td')
            .setProps({class: 'p-2 border-l-1 border-gray-200 text-sm'})
            .addChild(`${this.props.rating}`),

        ])
    }
}