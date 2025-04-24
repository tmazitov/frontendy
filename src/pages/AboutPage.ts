import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import CounterComponent from "../components/ConterComponent";
import AboutInfoComponent from "../components/about-page-content/AboutInfoComponent";

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
                elem("div")
                .setProps({ class : "flex flex-col items-center p-8" })
                .addChild(new AboutInfoComponent())
            ])
    }
}