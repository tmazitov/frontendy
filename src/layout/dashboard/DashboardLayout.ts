import FrontendyComponent from "../../pkg/frontendy/component/component";
import { elem, text } from "../../pkg/frontendy/vdom/constructor";


export default class DashboardComponent extends FrontendyComponent {
    componentName: string = 'dashboard-component';

    constructor(label: string) {
        super({label});
    }

    slots() {
        return [
            "content"
        ]
    }

    template() {

        const content = this.useSlot("content");

        return elem("div")
            .setProps({ 
                id: "dashboard-component",
                class : "max-w-2xl w-full rounded-lg overflow-hidden shadow-md bg-white p-6", 
            })
            .setChild([
                elem("h1")
                .setProps({ class : "text-2xl font-bold mb-4" })
                .addChild(text(this.props.label)),
                
                content,
            ]);
    }
}