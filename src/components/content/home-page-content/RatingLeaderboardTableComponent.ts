import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import RatingLeaderboardItemComponent from "./RatingLeaderboardItemComponent";

export default class RatingLeaderboardTableComponet extends FrontendyComponent {
    componentName: string = 'rating-leaderboard-table-component';   

    constructor(leaderboard: {nickname:string, value:number}[]) {
        super({leaderboard});
    }

    template() {

        const header = elem('thead')
        .setProps({class: 'sticky top-0 z-10'})
        .setChild([
            elem('tr').setChild([
                elem('th')
                .setProps({class: "p-2 w-1/6 text-start"})
                .addChild('#'),


                elem('th')
                .setProps({class: "p-2 w-1/2 text-start border-l-1 border-gray-200"})
                .addChild('Nickname'),

                elem('th')
                .setProps({class: "p-2 w-1/3 text-start border-l-1 border-gray-200"})
                .addChild('Rating'),

            ]),
        ])

        const body = elem('tbody')
        .setChild(this.props.leaderboard.map((item:{nickname:string, value:number}, index:number) => {
            return new RatingLeaderboardItemComponent(index, item.nickname, item.value);
        }))

        return elem('table')
        .setProps({class: 'min-w-full table-auto'})
        .setChild([
            header,
            body,
        ])
    }
}