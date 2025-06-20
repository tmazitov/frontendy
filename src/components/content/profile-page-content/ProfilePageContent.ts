import TabsLayout from "../../../layouts/tabs/TabsLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import FriendListComponent from "./friend-list/FriendListComponent";
import GamesContentComponent from "./game-list/GamesContentComponent";
import InfoContentComponent from "./InfoContentComponent";

export default class ProfilePageContent extends FrontendyComponent {
    componentName: string = 'profile-page-content';

    constructor(isFriend: boolean = false) {
        super({isFriend});
    }

    template() {

        const tabs = this.props.isFriend ?
            [
                {title: "Info", content: InfoContentComponent},
                {title: "Games", content: GamesContentComponent},
            ] :
            [
                {title: "Info", content: InfoContentComponent},
                {title: "Games", content: GamesContentComponent},
                {title: "Friends", content: FriendListComponent},
            ];

        return elem('div')
        .addChild(new TabsLayout("profile", tabs))
    }
}