import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";
import PlayButtonComponent from "./PlayButtonComponent";

export default class DashboardComponent extends FrontendyComponent {
    componentName: string = 'home-dashboard-component';

    template() {
        return elem("div")
            .setProps({ 
                id: "home-dashboard-component",
                class : "max-w-xl rounded-lg overflow-hidden shadow-lg bg-white p-6", 
            })
            .setChild([
                elem("h1")
                .setProps({ class : "text-2xl font-bold mb-4" })
                .addChild(text(`ft_transcendence`)),
                
                elem("div")
                .setProps({ class : "flex flex-col gap-2"})
                .setChild([
                    elem("p").addChild(text("Welcome to the ft_transcendence dashboard!")),
                    elem("p").addChild(text("This is a simple example of a Frontendy component.")),
                    new PlayButtonComponent()
                ])
            ]);
    }
}