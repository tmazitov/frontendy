import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";

export default class PlayButtonComponent extends FrontendyComponent {
    componentName: string = 'play-button-component';

    data() {
        return {}
    }

    template() {
        return elem('button')
            .setProps({
                class : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded",
            })
            .addChild(text("Play"))
    }
}