import ButtonComponent from "../components/inputs/ButtonComponent";
import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";
import router from "./router";

export default class NotFoundPage extends FrontendyComponent {
    static componentName: string = 'not-found-page';

    goHome() {
        router.push("home")
    }

    template() {
        return elem("div")
            .setProps({ 
                id: "not-found-page",
                class : "flex flex-col items-center justify-center h-full w-full p-8", 
            })
            .setChild([
                elem("div")
                .setProps({ class : "flex flex-col gap-4 p-4 rounded-lg max-w-lg w-full bg-white" })
                .setChild([
                    elem("h1")
                    .setProps({ class : "text-2xl font-bold text-gray-800" })
                    .addChild(text("404 Oups! Page not found...")),

                    elem("p")
                    .setProps({ class : "text-gray-600" })
                    .addChild(text("The page you are looking for does not exist.")),

                    new ButtonComponent({
                        label: "Main page",
                        type: "primary",
                    }).onClick(this.goHome.bind(this))
                ])
            ])
    }
}