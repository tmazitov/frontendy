import API from "../../../../api/api";
import LoadingLayout from "../../../../layouts/loading/LoadingLayout";
import router from "../../../../pages/router";
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

    constructor() {
        super();
        const currentRoute = router.currentRoute;
        const userId = currentRoute?.params?.userId;

        if (userId && !isNaN(parseInt(userId))) {
            this.state.userId = parseInt(userId);
            this.state.isOtherUser = true;
            console.log("this.state.isOtherUser", this.state.isOtherUser, this.state.userId);
        }
    }
    
    data() {
        return {
            games: undefined,
            isOtherUser: false,
            userId: 0,
            settings: {page: getLastPage()},
        }
    }



    protected onMounted(): void {

        console.log("this.state.isOtherUser ", this.state.isOtherUser)
        if (this.state.isOtherUser) {
            this.setupOtherUserGames();
            return ;
        }

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

    private setupOtherUserGames() {
        API.mmrs.userMatchStats(this.state.settings.page, this.state.userId).then((response) => {
            let gameStats: GameStat[] = [];
            if (response.status == 200) {
                gameStats = response.data.map((stat: any) => new GameStat(stat));
            }

            this.state.games = gameStats;
        })
    }

    private onNextPage() {
        if (this.state.games.length != 10) {
            return ;
        }

        this.state.settings.page += 1;
        localStorage.setItem("games-page", this.state.settings.page.toString());    

        if (this.state.isOtherUser) {
            this.setupOtherUserGames();
            return ;
        }

        Store.setters.setupGameStats(this.state.settings.page)
    }
    private onPrevPage() {
        if (this.state.settings.page == 0) {
            return ;
        }

        this.state.settings.page -= 1;
        localStorage.setItem("games-page", this.state.settings.page.toString());    

        if (this.state.isOtherUser) {
            this.setupOtherUserGames();
            return ;
        }

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