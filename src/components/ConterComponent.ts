import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";

export default class CounterComponent extends FrontendyComponent {
    componentName: string = 'counter-component';

    data() {
        return {
            count: 0,
        }
    }

    template() {
        return elem("div")
            .setProps({ id: "counter-component" })
            .setChild([
                elem("h1").addChild(text(`Count: ${this.state.count}`)),
                elem("button")
                    .setProps({ id: "increment-button" })
                    .addEventListener("click", this.increment.bind(this))
                    .addChild(text("Increment"))
            ]);
    }

    increment() {
        this.state.count++;
    }
}