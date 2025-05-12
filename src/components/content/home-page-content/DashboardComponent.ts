import { isAuthorized } from "../../../api/client";
import FrontendyComponent from "../../../pkg/frontendy/component/component";
import { elem, text } from "../../../pkg/frontendy/vdom/constructor";
import InfoParagraphComponent from "../../inputs/InfoParagraphComponent";
import PlayButtonComponent from "./PlayButtonComponent";

export default class DashboardComponent extends FrontendyComponent {
    componentName: string = 'home-dashboard-component';

    template() {
        return elem("div")
            .setProps({ 
                id: "home-dashboard-component",
                class : "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6", 
            })
            .setChild([
                elem("h1")
                .setProps({ class : "text-2xl font-bold mb-4" })
                .addChild(text(`Home`)),
                
                new InfoParagraphComponent("Welcome to the ft_transcendence!"),
                new InfoParagraphComponent("There will be some tools and players statistics soon."),
                
                isAuthorized() ?
                    new PlayButtonComponent()
                    :
                    new InfoParagraphComponent("You have to sign in in to play.")
            
            ]);
    }
}