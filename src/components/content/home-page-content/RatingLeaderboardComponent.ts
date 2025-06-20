import API from "../../../api/api";
import LoadingLayout from "../../../layouts/loading/LoadingLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import MessageComponent from "../../inputs/MessageComponent";
import RatingLeaderboardEmptyComponent from "./RatingLeaderboardEmptyComponent";
import RatingLeaderboardItemComponent from "./RatingLeaderboardItemComponent";
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
        try {
            const response = await API.ums.leaderboard()
            if (response && response.data) {
                console.log('data', response.data)
                this.state.leaderboard = response.data;
            }

        } catch (error) {
            console.error("DashboardComponent error : Failed to fetch leaderboard data", error);
        } finally {
            this.state.isLoading = false;
        }
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