import LoadingLayout from "../../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem, text } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import GameStat from "../../../../types/GameStat";
import GamesEmptyMessageComponent from "./GamesEmptyMessageComponet";
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

        const isLoading = this.state.games === undefined;
        console.log({isLoading})
        const views = [
            {cond: isLoading, action: () => new LoadingLayout({
                icon: "ti ti-loader",
                label: "Loading games...",
                withoutShadow: true,
            }).setShow(isLoading)},

            {cond: !isLoading && this.state.games.length === 0, action: () => new GamesEmptyMessageComponent()},
            {cond: !isLoading && this.state.games.length > 0, action: () => new GamesTableComponent(this.state.userId, this.state.games)},
        ]

        return elem('div')
        .setProps({class: "relative w-full h-full min-h-24"})
        .setChild([
            views.find((v) => v.cond)?.action(),
        ])
    }
}