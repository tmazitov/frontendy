import LoadingLayout from "../../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../../pkg/frontendy/component/component";
import { elem, text } from "../../../../pkg/frontendy/vdom/constructor";
import Store from "../../../../store/store";
import GameStat from "../../../../types/GameStat";
import GamesEmptyMessageComponent from "./GamesEmptyMessageComponet";
import GamesTableComponent from "./GamesTableComponent";


function getLastPage() {
    const page = localStorage.getItem("games-page");
    if (page === null) {
        return 0;
    }
    return parseInt(page);
}

export default class GamesContentComponent extends FrontendyComponent {
    componentName: string = 'games-content';

    data() {
        return {
            games: undefined,
            userId: 0,
            settings: {page: getLastPage()},
        }
    }

    protected onCreated(): void {
        Store.setters.setupGameStats(this.state.settings.page).then(() => {
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

    private onNextPage() {
        if (this.state.games.length != 10) {
            return ;
        }

        this.state.settings.page += 1;
        localStorage.setItem("games-page", this.state.settings.page.toString());    

        Store.setters.setupGameStats(this.state.settings.page)
    }
    private onPrevPage() {
        if (this.state.settings.page == 0) {
            return ;
        }

        this.state.settings.page -= 1;
        localStorage.setItem("games-page", this.state.settings.page.toString());    

        Store.setters.setupGameStats(this.state.settings.page)
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
            {cond: !isLoading && this.state.games.length > 0, action: () => new GamesTableComponent({
                userId:this.state.userId as number, 
                games:this.state.games as GameStat[],
                page:this.state.settings.page,
                onNextPage: () => this.onNextPage(),
                onPrevPage: () => this.onPrevPage(),
            })},
        ]

        return elem('div')
        .setProps({class: "relative w-full h-full min-h-24"})
        .setChild([
            views.find((v) => v.cond)?.action(),
        ])
    }
}