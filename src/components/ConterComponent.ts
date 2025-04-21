import FrontendyComponent from "../pkg/frontendy/component/component";
import { elem, text } from "../pkg/frontendy/vdom/constructor";

export default class CounterComponent extends FrontendyComponent {
    static componentName: string = 'counter-component';

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
                    .addChild(text("Increment"))
                    .addEventListener("click", this.increment.bind(this))
            ]);
    }

    increment() {
        this.state.count++;
    }
}