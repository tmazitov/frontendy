import TabsLayout from "../../../layouts/tabs/TabsLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import FriendListComponent from "./friend-list/FrienListComponent";
import GamesContentComponent from "./GamesContentComponent";
import InfoContentComponent from "./InfoContentComponent";

export default class ProfilePageContent extends FrontendyComponent {
    componentName: string = 'profile-page-content';

    data() {
        return {}
    }

    template() {
        return elem('div')
            .setChild([

                new TabsLayout("profile", [
                    {title: "Info", content: InfoContentComponent},
                    {title: "Games", content: GamesContentComponent},
                    {title: "Friends", content: FriendListComponent},
                ])
            ])
    }
}