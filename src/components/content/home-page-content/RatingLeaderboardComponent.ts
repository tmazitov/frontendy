import LoadingLayout from "../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import Store from "../../../store/store";
import RatingLeaderboardEmptyComponent from "./RatingLeaderboardEmptyComponent";
import RatingLeaderboardTableComponet from "./RatingLeaderboardTableComponent";

export default class RatingLeaderboardComponent extends FrontendyComponent {
    componentName: string = 'rating-leaderboard-component';

    protected data(): {} {
        return {
            leaderboard: [],
            isLoading: false,
        }
    }

    protected async onMounted() {
        this.state.isLoading = true;
        Store.getters.leaderboard().then((leaderboard: any | undefined) => {
            this.state.isLoading = false;
            if (!leaderboard) {
                this.state.leaderboard = [];
                return ;
            }
            this.state.leaderboard = leaderboard;
        })
    }

    template() {

        let content:any = new RatingLeaderboardEmptyComponent()
        if (this.state.leaderboard.length > 0) {
            content = new RatingLeaderboardTableComponet(this.state.leaderboard);
        }

        return elem('div')
        .setProps({class : "max-h-[320px] w-full overflow-y-auto relative mb-4"})
        .setChild([

            content,

            new LoadingLayout({
                label: "Loading leaderboard...",
                icon: "ti ti-loader",
            }).setShow(this.state.isLoading),
        ])
    }
}