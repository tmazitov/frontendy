import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";

export default class NotFoundPage extends FrontendyComponent {
    static componentName: string = 'not-found-page';

    data() {
        return {
            message: "404 Not Found",
        }
    }

    template() {
        return elem("div")
            .setProps({ id: "not-found-page" })
            .setChild([
                elem("h1")
                    .addChild(text(this.state.message)),
                elem("p")
                    .addChild(text("The page you are looking for does not exist.")),
            ])
    }
}