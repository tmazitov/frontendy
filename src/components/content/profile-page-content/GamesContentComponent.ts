import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import GameStat from "../../../types/GameStat";
import GamesTableComponent from "./GamesTableComponent";


export default class GamesContentComponent extends FrontendyComponent {
    componentName: string = 'games-content';

    data() {
        return {
            games: undefined,
            userId: 0,
        }
    }

    protected onCreated(): void {
        Store.setters.setupGameStats().then(() => {
            Store.getters.gameStats((stats:GameStat[] | undefined) => {
                this.state.games = stats || [];
            } )
        })
        Store.getters.userId((userId:number | undefined) => {
            if (userId === undefined) {
                return;
            }
            this.state.userId = userId;
        })
    }

    template() {

        let content
        const isLoading = this.state.games === undefined;
        if (isLoading) {
            content = elem('div')
                .setProps({class: "flex flex-col items-center justify-center h-full w-full"})
                .setChild([
                    elem('i')
                    .setProps({class: "ti ti-loader loading text-blue-500"}),
                    'Loading games...'
                ]);
        } else if (this.state.games.length === 0) {
            content = elem('div')
                .setProps({class: "flex flex-col items-center justify-center h-full w-full text-gray-400"})
                .setChild([
                    elem('i')
                    .setProps({class: "ti ti-brand-apple-arcade "}),
                    'No games found'
                ]);
        } else {
            content = new GamesTableComponent(this.state.userId, this.state.games)
        }

        return elem('div').addChild(content)
    }
}