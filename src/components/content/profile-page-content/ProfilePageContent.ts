import TabsLayout from "../../../layout/tabs/TabsLayout";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
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

                new TabsLayout([
                    {title: "Info", content: new InfoContentComponent()},
                    {title: "Games", content: new GamesContentComponent()},
                ])
            ])
    }
}