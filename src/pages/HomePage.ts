import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import CounterComponent from "../components/ConterComponent";
import DashboardComponent from "../components/home-page-content/DashboardComponent";


export default class HomePage extends FrontendyComponent {
    componentName: string = 'home-page';

    data() {
        return {
            title: "Welcome to Frontendy",
            description: "This is a simple example of a Frontendy component.",
        }
    }

    template() {
        return elem("div")
            .setProps({ id: "home-page"})
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col items-center p-8" })
                .addChild(new DashboardComponent())
        ])
    }
}