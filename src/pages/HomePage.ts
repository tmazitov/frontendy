import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import CounterComponent from "../components/ConterComponent";

export default class HomePage extends FrontendyComponent {
    static componentName: string = 'home-page';

    data() {
        return {
            title: "Welcome to Frontendy",
            description: "This is a simple example of a Frontendy component.",
        }
    }

    template() {
        return elem("div")
            .setProps({ id: "home-page" })
            .setChild([
                elem("h1").addChild(text(this.state.title)),
                elem("p").addChild(text(this.state.description)),
                new CounterComponent()
            ])
    }
}