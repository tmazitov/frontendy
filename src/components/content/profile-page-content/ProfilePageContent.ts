import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";

export default class ProfilePageContent extends FrontendyComponent {
    componentName: string = 'profile-page-content';

    data() {
        return {}
    }

    template() {
        return elem('div')
            .setChild([text("Profile Page Content")])
    }
}