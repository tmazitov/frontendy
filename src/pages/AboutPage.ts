import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import CounterComponent from "../components/ConterComponent";

export default class AboutPage extends FrontendyComponent {
    componentName: string = 'about-page';

    data() {
        return {
            title: "About Us",
            description: "Example text about us.",
        }
    }

    template() {
        return elem("div")
            .setProps({ id: "about-page" })
            .setChild([
                elem("h1").addChild(text(this.state.title)),
                elem("p").addChild(text(this.state.description)),
                new CounterComponent()
            ])
    }
}