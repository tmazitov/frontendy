import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem } from "../../../pkg/frontendy/vdom/constructor";
import MessageComponent from "../../inputs/MessageComponent";

export default class RatingLeaderboardEmptyComponent extends FrontendyComponent {
    componentName: string = 'rating-leaderboard-empty-component';

    data() {
        return {}
    }

    template() {
        return elem('div')
            .setProps({class : "flex items-center justify-center h-full w-full p-4 rounded-md border-1 border-gray-200 bg-gray-50"})
            .addChild(new MessageComponent("No leaderboard data available"))
    }
}